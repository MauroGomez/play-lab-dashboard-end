import { NextResponse } from 'next/server';
import postgres from 'postgres';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const CreateInvoice = z.object({
  customerId: z.string().min(1, { message: 'Please select a customer.' }),
  movieId: z.string().min(1, { message: 'Please select a movie.' }),
  type: z.enum(['rental', 'purchase'], {
    invalid_type_error: 'Please select an invoice type.',
  }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    movieId: formData.get('movieId'),
    type: formData.get('type'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return NextResponse.json(
      {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      },
      { status: 400 },
    );
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
      return NextResponse.json(
        { message: 'Movie not found. Failed to Create Invoice.' },
        { status: 404 },
      );
    }

    const amount =
      type === 'purchase' ? movie.purchase_price : movie.rental_price;

    await sql`
      INSERT INTO invoices (customer_id, movie_id, type, amount, status, date)
      VALUES (${customerId}, ${movieId}, ${type}, ${amount}, ${status}, ${date})
    `;
  } catch (error) {
    return NextResponse.json(
      { message: 'Database Error: Failed to Create Invoice.' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: 'Created invoice.' },
    { status: 201 },
  );
}
