'use server';

import { z } from 'zod';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { MovieFormErrors, validateMovie } from '@/model/validation';
import * as model from '@/model/data';


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
    userId?: string[];
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

export async function createTransaction(prevState: State, formData: FormData) {
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
  
  // revalidatePath('/dashboard/movies');
  // redirect('/dashboard/movies');

  return {
    success: true,
    errors: {},
    message: null,
  };
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
