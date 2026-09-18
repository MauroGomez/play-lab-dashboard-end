'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createMovieData } from '@/model/data';
import {
  type MovieFormErrors,
  validateMovie,
} from '../app/model/validation';

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
    await createMovieData(validationResult.data);
  } catch (error) {
    return {
      success: false,
      errors: {},
      message: 'Failed to create movie.',
    };
  }

  revalidatePath('/dashboard/movies');
  redirect('/dashboard/movies');
}
