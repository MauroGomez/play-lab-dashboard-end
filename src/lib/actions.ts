'use server';

import { z } from 'zod';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { MovieFormErrors, validateMovie } from '@/model/validation';
import * as model from '@/model/data';
import { can } from '@/lib/authorization';


const FormSchema = z.object({
  id: z.string(),
  userId: z.string().min(1, { message: 'Please select a user.' }),
  movieId: z.string().min(1, { message: 'Please select a movie.' }),
  type: z.enum(['rental', 'purchase'], {
    invalid_type_error: 'Please select a transaction type.',
  }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select a transaction status.',
  }),
  date: z.string(),
});

const CreateTransaction = FormSchema.omit({ id: true, date: true });
const UpdateTransaction = FormSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    userId?: string[];
    movieId?: string[];
    type?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createTransaction(prevState: State, formData: FormData) {
  if (!(await can('transactions:create'))) {
    return { message: 'Unauthorized: you cannot create transactions.' };
  }

  // Validate form fields using Zod
  const validatedFields = CreateTransaction.safeParse({
    userId: formData.get('userId'),
    movieId: formData.get('movieId'),
    type: formData.get('type'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Transaction.',
    };
  }

  const { userId, movieId, type, status } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];

  try {
    const movies = await sql<{ purchase_price: number; rental_price: number }[]>`
      SELECT purchase_price, rental_price
      FROM movies
      WHERE id = ${movieId}
    `;

    const movie = movies[0];

    if (!movie) {
      return { message: 'Movie not found. Failed to Create Transaction.' };
    }

    const amount =
      type === 'purchase' ? movie.purchase_price : movie.rental_price;

    await sql`
      INSERT INTO transactions (user_id, movie_id, type, amount, status, date)
      VALUES (${userId}, ${movieId}, ${type}, ${amount}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Transaction.',
    };
  }

  revalidatePath('/dashboard/transactions');
  redirect('/dashboard/transactions');
}

export async function updateTransaction(
  id: string,
  prevState: State,
  formData: FormData,
) {
  if (!(await can('transactions:update'))) {
    return { message: 'Unauthorized: you cannot update transactions.' };
  }

  const validatedFields = UpdateTransaction.safeParse({
    userId: formData.get('userId'),
    movieId: formData.get('movieId'),
    type: formData.get('type'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Transaction.',
    };
  }

  const { userId, movieId, type, status } = validatedFields.data;

  try {
    const movies = await sql<{ purchase_price: number; rental_price: number }[]>`
      SELECT purchase_price, rental_price
      FROM movies
      WHERE id = ${movieId}
    `;

    const movie = movies[0];

    if (!movie) {
      return { message: 'Movie not found. Failed to Update Transaction.' };
    }

    const amount =
      type === 'purchase' ? movie.purchase_price : movie.rental_price;

    await sql`
      UPDATE transactions
      SET
        user_id = ${userId},
        movie_id = ${movieId},
        type = ${type},
        amount = ${amount},
        status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Transaction.' };
  }

  revalidatePath('/dashboard/transactions');
  redirect('/dashboard/transactions');
}

export async function deleteTransaction(id: string) {
  if (!(await can('transactions:delete'))) {
    throw new Error('Unauthorized: you cannot delete transactions.');
  }
  await sql`DELETE FROM transactions WHERE id = ${id}`;
  revalidatePath('/dashboard/transactions');
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
