import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { z } from 'zod';


const CreateTransaction = z.object({
  userId: z.string().min(1, { message: 'Please select a user.' }),
  movieId: z.string().min(1, { message: 'Please select a movie.' }),
  type: z.enum(['rental', 'purchase'], {
    invalid_type_error: 'Please select a transaction type.',
  }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select a transaction status.',
  }),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const validatedFields = CreateTransaction.safeParse({
    userId: formData.get('userId'),
    movieId: formData.get('movieId'),
    type: formData.get('type'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return NextResponse.json(
      {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Transaction.',
      },
      { status: 400 },
    );
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
      return NextResponse.json(
        { message: 'Movie not found. Failed to Create Transaction.' },
        { status: 404 },
      );
    }

    const amount =
      type === 'purchase' ? movie.purchase_price : movie.rental_price;

    await sql`
      INSERT INTO transactions (user_id, movie_id, type, amount, status, date)
      VALUES (${userId}, ${movieId}, ${type}, ${amount}, ${status}, ${date})
    `;
  } catch (error) {
    return NextResponse.json(
      { message: 'Database Error: Failed to Create Transaction.' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: 'Created transaction.' },
    { status: 201 },
  );
}
