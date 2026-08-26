import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { invoices, customers, movies, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function ensureUuidExtension(sql: postgres.Sql) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

async function seedUsers(sql: postgres.Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices(sql: postgres.Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      movie_id UUID NOT NULL,
      type VARCHAR(255) NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS movie_id UUID;`;
  await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS type VARCHAR(255);`;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (id, customer_id, movie_id, type, amount, status, date)
        VALUES (
          ${invoice.id},
          ${invoice.customer_id},
          ${invoice.movie_id},
          ${invoice.type},
          ${invoice.amount},
          ${invoice.status},
          ${invoice.date}
        )
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers(sql: postgres.Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedMovies(sql: postgres.Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS movies (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      director VARCHAR(255) NOT NULL,
      genre VARCHAR(255) NOT NULL,
      release_year INT NOT NULL,
      rating VARCHAR(255) NOT NULL,
      duration_minutes INT NOT NULL,
      purchase_price INT NOT NULL,
      rental_price INT NOT NULL,
      status VARCHAR(255) NOT NULL
    );
  `;

  const insertedMovies = await Promise.all(
    movies.map(
      (movie) => sql`
        INSERT INTO movies (
          id,
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
          ${movie.id},
          ${movie.title},
          ${movie.director},
          ${movie.genre},
          ${movie.release_year},
          ${movie.rating},
          ${movie.duration_minutes},
          ${movie.purchase_price},
          ${movie.rental_price},
          ${movie.status}
        )
        ON CONFLICT (title) DO UPDATE SET
          id = EXCLUDED.id,
          title = EXCLUDED.title,
          director = EXCLUDED.director,
          genre = EXCLUDED.genre,
          release_year = EXCLUDED.release_year,
          rating = EXCLUDED.rating,
          duration_minutes = EXCLUDED.duration_minutes,
          purchase_price = EXCLUDED.purchase_price,
          rental_price = EXCLUDED.rental_price,
          status = EXCLUDED.status
      `,
    ),
  );

  return insertedMovies;
}

async function seedRevenue(sql: postgres.Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await ensureUuidExtension(sql);
      await seedUsers(sql);
      await seedCustomers(sql);
      await seedMovies(sql);
      await seedInvoices(sql);
      await seedRevenue(sql);
    });

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
