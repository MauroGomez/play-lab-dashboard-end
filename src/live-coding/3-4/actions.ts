'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createMovie } from '../3-2/data';
import {
    type MovieFormErrors,
    validateMovie,
} from './model/validation';

type CreateMovieState = {
    success: boolean;
    errors: MovieFormErrors;
    message: string | null;
};

export async function createMovieAction(
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
        await createMovie(validationResult.data);
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
