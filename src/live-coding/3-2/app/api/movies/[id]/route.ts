import { NextResponse } from 'next/server';
import { deleteMovieData, getMovieData, updateMovieData, type MovieInput } from '@/model/data';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const movie = await getMovieData(id);

    if (!movie) {
      return NextResponse.json(
        { message: 'Movie not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch movie.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let body: MovieInput;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  try {
    const movie = await updateMovieData(id, body);

    if (!movie) {
      return NextResponse.json(
        { message: 'Movie not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update movie.' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const movieDeleted = await deleteMovieData(id);

    if (!movieDeleted) {
      return NextResponse.json(
        { message: 'Movie not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Deleted movie.' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete movie.' },
      { status: 500 },
    );
  }
}
