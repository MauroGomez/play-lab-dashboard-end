'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

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

const MovieFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: 'Please enter a title.' }),
  director: z.string().min(1, { message: 'Please enter a director.' }),
  genre: z.string().min(1, { message: 'Please enter a genre.' }),
  releaseYear: z.coerce
    .number()
    .int()
    .min(1888, { message: 'Please enter a valid release year.' }),
  rating: z.string().min(1, { message: 'Please enter a rating.' }),
  durationMinutes: z.coerce
    .number()
    .int()
    .gt(0, { message: 'Please enter a duration greater than 0.' }),
  purchasePrice: z.coerce
    .number()
    .gt(0, { message: 'Please enter a purchase price greater than $0.' }),
  rentalPrice: z.coerce
    .number()
    .gt(0, { message: 'Please enter a rental price greater than $0.' }),
  status: z.enum(['available', 'draft', 'archived'], {
    invalid_type_error: 'Please select a movie status.',
  }),
});

const CreateMovie = MovieFormSchema.omit({ id: true });
const UpdateMovie = MovieFormSchema.omit({ id: true });

export type State = {
  errors?: {
    customerId?: string[];
    movieId?: string[];
    type?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type MovieState = {
  errors?: {
    title?: string[];
    director?: string[];
    genre?: string[];
    releaseYear?: string[];
    rating?: string[];
    durationMinutes?: string[];
    purchasePrice?: string[];
    rentalPrice?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
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
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function createMovie(prevState: MovieState, formData: FormData) {
  const validatedFields = CreateMovie.safeParse({
    title: formData.get('title'),
    director: formData.get('director'),
    genre: formData.get('genre'),
    releaseYear: formData.get('releaseYear'),
    rating: formData.get('rating'),
    durationMinutes: formData.get('durationMinutes'),
    purchasePrice: formData.get('purchasePrice'),
    rentalPrice: formData.get('rentalPrice'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Movie.',
    };
  }

  const {
    title,
    director,
    genre,
    releaseYear,
    rating,
    durationMinutes,
    purchasePrice,
    rentalPrice,
    status,
  } = validatedFields.data;

  const purchasePriceInCents = purchasePrice * 100;
  const rentalPriceInCents = rentalPrice * 100;

  try {
    await sql`
      INSERT INTO movies (
        title,
        director,
        genre,
        release_year,
        rating,
        duration_minutes,
        purchase_price,
        rental_price,
        status
      )
      VALUES (
        ${title},
        ${director},
        ${genre},
        ${releaseYear},
        ${rating},
        ${durationMinutes},
        ${purchasePriceInCents},
        ${rentalPriceInCents},
        ${status}
      )
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Movie.',
    };
  }

  revalidatePath('/dashboard/movies');
  redirect('/dashboard/movies');
}

export async function updateMovie(
  id: string,
  prevState: MovieState,
  formData: FormData,
) {
  const validatedFields = UpdateMovie.safeParse({
    title: formData.get('title'),
    director: formData.get('director'),
    genre: formData.get('genre'),
    releaseYear: formData.get('releaseYear'),
    rating: formData.get('rating'),
    durationMinutes: formData.get('durationMinutes'),
    purchasePrice: formData.get('purchasePrice'),
    rentalPrice: formData.get('rentalPrice'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Movie.',
    };
  }

  const {
    title,
    director,
    genre,
    releaseYear,
    rating,
    durationMinutes,
    purchasePrice,
    rentalPrice,
    status,
  } = validatedFields.data;

  const purchasePriceInCents = purchasePrice * 100;
  const rentalPriceInCents = rentalPrice * 100;

  try {
    await sql`
      UPDATE movies
      SET
        title = ${title},
        director = ${director},
        genre = ${genre},
        release_year = ${releaseYear},
        rating = ${rating},
        duration_minutes = ${durationMinutes},
        purchase_price = ${purchasePriceInCents},
        rental_price = ${rentalPriceInCents},
        status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Movie.' };
  }

  revalidatePath('/dashboard/movies');
  redirect('/dashboard/movies');
}

export async function deleteMovie(id: string) {
  await sql`DELETE FROM movies WHERE id = ${id}`;
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
