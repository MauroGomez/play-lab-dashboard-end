import { NextResponse } from 'next/server';
import { createMovieData, getMoviesData, type MovieInput } from '@/model/data';

export async function GET() {
  try {
    const movies = await getMoviesData();

    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch movies.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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
    const movie = await createMovieData(body);

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create movie.' },
      { status: 500 },
    );
  }
}
