import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { invoices, customers, movies, revenue, users } from './placeholder-data.ts';
import { sql, getDatabaseName, getDatabaseOptions } from '../../src/lib/db.ts';

const ADMIN_DATABASE_NAME = 'neondb';

async function ensureUuidExtension(sql: postgres.TransactionSql) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

async function seedUsers(sql: postgres.TransactionSql) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role VARCHAR(255) NOT NULL DEFAULT 'admin'
    );
  `;

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(255) NOT NULL DEFAULT 'admin';`;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password, role)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices(sql: postgres.TransactionSql) {
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

async function seedCustomers(sql: postgres.TransactionSql) {
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

async function seedMovies(sql: postgres.TransactionSql) {
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

async function seedRevenue(sql: postgres.TransactionSql) {
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

async function setup() {
  const databaseName = getDatabaseName();
  const adminSql = postgres(getDatabaseOptions(ADMIN_DATABASE_NAME));
  try {
    const [database] = await adminSql`
      SELECT pg_get_userbyid(datdba) AS owner,
             pg_get_userbyid(datdba) = current_user AS owned_by_current_user
      FROM pg_database WHERE datname = ${databaseName}
    `;
    if (database && !database.owned_by_current_user) {
      throw new Error(`La base ${databaseName} pertenece a ${database.owner}. Revisá el grupo configurado.`);
    }
    console.log(`Recreando ${databaseName}: se eliminarán todos sus datos.`);
    await adminSql`DROP DATABASE IF EXISTS ${adminSql(databaseName)} WITH (FORCE)`;
    await adminSql`CREATE DATABASE ${adminSql(databaseName)}`;
    // El propietario conserva el acceso; los otros grupos no lo reciben por PUBLIC.
    await adminSql`REVOKE CONNECT ON DATABASE ${adminSql(databaseName)} FROM PUBLIC`;
  } finally {
    await adminSql.end();
  }

  try {
    await sql.begin(async (tx) => {
      await ensureUuidExtension(tx);
      await seedUsers(tx);
      await seedCustomers(tx);
      await seedMovies(tx);
      await seedInvoices(tx);
      await seedRevenue(tx);
    });
    console.log(`Base ${databaseName} creada y datos iniciales cargados.`);
  } finally {
    await sql.end();
  }
}

setup().catch((error: unknown) => {
  // No imprimir objetos del driver que puedan incluir credenciales.
  console.error(error instanceof Error ? error.message : 'Error al preparar la base de datos.');
  process.exitCode = 1;
});
