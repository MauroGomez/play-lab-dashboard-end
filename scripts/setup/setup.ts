import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { transactions, users, movies, revenue, staffUsers } from './placeholder-data.ts';
import { sql, getDatabaseName, getDatabaseOptions } from '../../src/lib/db.ts';

const ADMIN_DATABASE_NAME = 'neondb';

async function ensureUuidExtension(sql: postgres.TransactionSql) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

async function seedStaffUsers(sql: postgres.TransactionSql) {
  await sql`
    CREATE TABLE IF NOT EXISTS staff_users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role VARCHAR(255) NOT NULL DEFAULT 'admin'
    );
  `;

  const insertedStaffUsers = await Promise.all(
    staffUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO staff_users (id, name, email, password, role)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedStaffUsers;
}

async function seedTransactions(sql: postgres.TransactionSql) {
  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      movie_id UUID NOT NULL,
      type VARCHAR(255) NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedTransactions = await Promise.all(
    transactions.map(
      (transaction) => sql`
        INSERT INTO transactions (id, user_id, movie_id, type, amount, status, date)
        VALUES (
          ${transaction.id},
          ${transaction.user_id},
          ${transaction.movie_id},
          ${transaction.type},
          ${transaction.amount},
          ${transaction.status},
          ${transaction.date}
        )
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedTransactions;
}

async function seedUsers(sql: postgres.TransactionSql) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(
      (user) => sql`
        INSERT INTO users (id, name, email, image_url)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${user.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedUsers;
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
      await seedStaffUsers(tx);
      await seedUsers(tx);
      await seedMovies(tx);
      await seedTransactions(tx);
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
