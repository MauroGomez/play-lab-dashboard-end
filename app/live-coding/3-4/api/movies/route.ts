import { NextResponse } from 'next/server';
import { createMovie } from '../../../3-2/data';
import { validateMovie } from '../../model/validation';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const validationResult = validateMovie(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.fieldErrors,
        message: validationResult.message,
      },
      { status: 400 },
    );
  }

  try {
    const movie = await createMovie(validationResult.data);

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create movie.' },
      { status: 500 },
    );
  }
}
