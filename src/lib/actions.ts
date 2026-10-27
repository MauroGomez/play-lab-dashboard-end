'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { MovieFormErrors, validateMovie } from '@/model/validation';
import * as model from '@/model/data';
import { can } from '@/lib/authorization';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string().min(1, { message: 'Please select a customer.' }),
  movieId: z.string().min(1, { message: 'Please select a movie.' }),
  type: z.enum(['rental', 'purchase'], {
    invalid_type_error: 'Please select an invoice type.',
  }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    customerId?: string[];
    movieId?: string[];
    type?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  if (!(await can('invoices:create'))) {
    return { message: 'Unauthorized: you cannot create invoices.' };
  }

  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    movieId: formData.get('movieId'),
    type: formData.get('type'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, movieId, type, status } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];

  try {
    const movies = await sql<{ purchase_price: number; rental_price: number }[]>`
      SELECT purchase_price, rental_price
      FROM movies
      WHERE id = ${movieId}
    `;

    const movie = movies[0];

    if (!movie) {
      return { message: 'Movie not found. Failed to Create Invoice.' };
    }

    const amount =
      type === 'purchase' ? movie.purchase_price : movie.rental_price;

    await sql`
      INSERT INTO invoices (customer_id, movie_id, type, amount, status, date)
      VALUES (${customerId}, ${movieId}, ${type}, ${amount}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  if (!(await can('invoices:update'))) {
    return { message: 'Unauthorized: you cannot update invoices.' };
  }

  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    movieId: formData.get('movieId'),
    type: formData.get('type'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, movieId, type, status } = validatedFields.data;

  try {
    const movies = await sql<{ purchase_price: number; rental_price: number }[]>`
      SELECT purchase_price, rental_price
      FROM movies
      WHERE id = ${movieId}
    `;

    const movie = movies[0];

    if (!movie) {
      return { message: 'Movie not found. Failed to Update Invoice.' };
    }

    const amount =
      type === 'purchase' ? movie.purchase_price : movie.rental_price;

    await sql`
      UPDATE invoices
      SET
        customer_id = ${customerId},
        movie_id = ${movieId},
        type = ${type},
        amount = ${amount},
        status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  if (!(await can('invoices:delete'))) {
    throw new Error('Unauthorized: you cannot delete invoices.');
  }
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

type CreateMovieState = {
  success: boolean;
  errors: MovieFormErrors;
  message: string | null;
};

export async function createMovie(
  movieData: unknown,
): Promise<CreateMovieState> {
  if (!(await can('movies:create'))) {
    return {
      success: false,
      errors: {},
      message: 'Unauthorized: you cannot create movies.',
    };
  }

  const validationResult = validateMovie(movieData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.fieldErrors,
      message: validationResult.message,
    };
  }

  try {
    await model.createMovie(validationResult.data);
  } catch (error) {
    return {
      success: false,
      errors: {},
      message: 'Failed to create movie.',
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay for demonstration purposes
  
  // revalidatePath('/dashboard/movies');
  // redirect('/dashboard/movies');

  return {
    success: true,
    errors: {},
    message: null,
  };
}

type UpdateMovieState = CreateMovieState;

export async function updateMovie(
  id: string,
  movieData: unknown,
): Promise<UpdateMovieState> {
  if (!(await can('movies:update'))) {
    return {
      success: false,
      errors: {},
      message: 'Unauthorized: you cannot update movies.',
    };
  }

  const validationResult = validateMovie(movieData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.fieldErrors,
      message: validationResult.message,
    };
  }

  try {
    await model.updateMovie(id, validationResult.data);
  } catch (error) {
    return {
      success: false,
      errors: {},
      message: 'Failed to update movie.',
    };
  }

  revalidatePath('/dashboard/movies');
  return { success: true, errors: {}, message: null };
}

export async function deleteMovie(id: string) {
  if (!(await can('movies:delete'))) {
    throw new Error('Unauthorized: you cannot delete movies.');
  }
  await model.deleteMovie(id);
  revalidatePath('/dashboard/movies');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
