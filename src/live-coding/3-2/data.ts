import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

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

export type Movie = MovieInput & {
  id: string;
};

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
    WHERE id = ${id}
  `;

  return movies[0];
}

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
