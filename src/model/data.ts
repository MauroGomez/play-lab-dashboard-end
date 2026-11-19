import { sql } from '@/lib/db';
import { unstable_cache } from 'next/cache';
import {
  UserField,
  UsersTableType,
  TransactionForm,
  TransactionsTable,
  LatestTransactionRaw,
  Movie,
  MovieField,
  Revenue,
} from './definitions';
import { formatCurrency } from '@/lib/utils';


export async function getRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function getLatestTransactions() {
  try {
    const data = await sql<LatestTransactionRaw[]>`
      SELECT transactions.amount, users.name, users.image_url, users.email, transactions.id
      FROM transactions
      JOIN users ON transactions.user_id = users.id
      ORDER BY transactions.date DESC
      LIMIT 5`;

    const latestTransactions = data.map((transaction) => ({
      ...transaction,
      amount: formatCurrency(transaction.amount),
    }));
    return latestTransactions;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest transactions.');
  }
}

export async function getCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const transactionCountPromise = sql`SELECT COUNT(*) FROM transactions`;
    const userCountPromise = sql`SELECT COUNT(*) FROM users`;
    const transactionStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM transactions`;

    const data = await Promise.all([
      transactionCountPromise,
      userCountPromise,
      transactionStatusPromise,
    ]);

    const numberOfTransactions = Number(data[0][0].count ?? '0');
    const numberOfUsers = Number(data[1][0].count ?? '0');
    const totalPaidTransactions = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingTransactions = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfUsers,
      numberOfTransactions,
      totalPaidTransactions,
      totalPendingTransactions,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function getFilteredTransactions(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const transactions = await sql<TransactionsTable[]>`
      SELECT
        transactions.id,
        transactions.user_id,
        transactions.movie_id,
        transactions.type,
        transactions.amount,
        transactions.date,
        transactions.status,
        users.name,
        users.email,
        users.image_url,
        movies.title AS movie_title
      FROM transactions
      JOIN users ON transactions.user_id = users.id
      JOIN movies ON transactions.movie_id = movies.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        movies.title ILIKE ${`%${query}%`} OR
        transactions.type ILIKE ${`%${query}%`} OR
        transactions.amount::text ILIKE ${`%${query}%`} OR
        transactions.date::text ILIKE ${`%${query}%`} OR
        transactions.status ILIKE ${`%${query}%`}
      ORDER BY transactions.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return transactions;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transactions.');
  }
}

export async function getTransactionsPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM transactions
      JOIN users ON transactions.user_id = users.id
      JOIN movies ON transactions.movie_id = movies.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        movies.title ILIKE ${`%${query}%`} OR
        transactions.type ILIKE ${`%${query}%`} OR
        transactions.amount::text ILIKE ${`%${query}%`} OR
        transactions.date::text ILIKE ${`%${query}%`} OR
        transactions.status ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of transactions.');
  }
}

export async function getTransaction(id: string) {
  try {
    const data = await sql<TransactionForm[]>`
      SELECT
        transactions.id,
        transactions.user_id,
        transactions.movie_id,
        transactions.type,
        transactions.status
      FROM transactions
      WHERE transactions.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transaction.');
  }
}

export async function getUserSummaries() {
  try {
    const users = await sql<UserField[]>`
      SELECT
        id,
        name
      FROM users
      ORDER BY name ASC
    `;

    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

export async function getFilteredUsers(query: string) {
  try {
    const data = await sql<UsersTableType[]>`
      SELECT
        users.id,
        users.name,
        users.email,
        users.image_url,
        COUNT(transactions.id) AS total_transactions,
        COALESCE(SUM(CASE WHEN transactions.status = 'pending' THEN transactions.amount ELSE 0 END), 0) AS total_pending,
        COALESCE(SUM(CASE WHEN transactions.status = 'paid' THEN transactions.amount ELSE 0 END), 0) AS total_paid
      FROM users
      LEFT JOIN transactions ON users.id = transactions.user_id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`}
      GROUP BY users.id, users.name, users.email, users.image_url
      ORDER BY users.name ASC
    `;

    const users = data.map((user) => ({
      ...user,
      total_pending: formatCurrency(user.total_pending),
      total_paid: formatCurrency(user.total_paid),
    }));

    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch user table.');
  }
}

export async function getFilteredMovies(query: string = "", currentPage: number = 1) {
  // console.log('Fetching filtered movies with query:', query, 'and currentPage:', currentPage, new Date().toISOString());
  // await new Promise((resolve) => setTimeout(resolve, 4000)); // Simulate a 2-second delay
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const movies = await sql<Movie[]>`
      SELECT
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
      FROM movies
      WHERE
        title ILIKE ${`%${query}%`} OR
        director ILIKE ${`%${query}%`} OR
        genre ILIKE ${`%${query}%`} OR
        release_year::text ILIKE ${`%${query}%`} OR
        rating ILIKE ${`%${query}%`} OR
        status ILIKE ${`%${query}%`}
      ORDER BY title ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    // console.log('Fetched filtered movies:', movies.length, new Date().toISOString());
    return movies;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch movies.');
  }
}

export async function getMovieSummaries() {
  try {
    const movies = await sql<MovieField[]>`
      SELECT
        id,
        title,
        purchase_price,
        rental_price
      FROM movies
      ORDER BY title ASC
    `;

    return movies;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all movies.');
  }
}

export async function getMoviesPagesUncached(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM movies
      WHERE
        title ILIKE ${`%${query}%`} OR
        director ILIKE ${`%${query}%`} OR
        genre ILIKE ${`%${query}%`} OR
        release_year::text ILIKE ${`%${query}%`} OR
        rating ILIKE ${`%${query}%`} OR
        status ILIKE ${`%${query}%`}
    `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of movies.');
  }
}

export const getMoviesPages = unstable_cache(
  getMoviesPagesUncached,
  ['movies-pages'],
  { revalidate: 300 },
);

// export const getMoviesPages = getMoviesPagesUncached;

export async function getMovies() {
  const movies = await sql<Movie[]>`
    SELECT
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
    FROM movies
    ORDER BY title ASC
  `;

  return movies;
}

export async function getMovie(id: string) {
  try {
    const data = await sql<Movie[]>`
      SELECT
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
      FROM movies
      WHERE id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch movie.');
  }
}

export type MovieInput = {
  title: string;
  director: string;
  genre: string;
  release_year: number;
  rating: string;
  duration_minutes: number;
  purchase_price: number;
  rental_price: number;
  status: 'available' | 'draft' | 'archived';
};

export async function createMovie(movie: MovieInput) {
  const movies = await sql<Movie[]>`
    INSERT INTO movies (
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
    RETURNING
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
  `;

  return movies[0];
}

export async function updateMovie(id: string, movie: MovieInput) {
  const movies = await sql<Movie[]>`
    UPDATE movies
    SET
      title = ${movie.title},
      director = ${movie.director},
      genre = ${movie.genre},
      release_year = ${movie.release_year},
      rating = ${movie.rating},
      duration_minutes = ${movie.duration_minutes},
      purchase_price = ${movie.purchase_price},
      rental_price = ${movie.rental_price},
      status = ${movie.status}
    WHERE id = ${id}
    RETURNING
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
  `;

  return movies[0];
}

export async function deleteMovie(id: string) {
  const movies = await sql<{ id: string }[]>`
    DELETE FROM movies
    WHERE id = ${id}
    RETURNING id
  `;

  return Boolean(movies[0]);
}