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

const ITEMS_PER_PAGE = 6;

export async function getFilteredMoviesData(query: string, currentPage: number) {
  // console.log('Fetching filtered movies with query:', query, 'and currentPage:', currentPage, new Date().toISOString());
  // await new Promise((resolve) => setTimeout(resolve, 4000)); // Simulate a 2-second delay
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // ⚠️⚠️⚠️  VERSIÓN DELIBERADAMENTE VULNERABLE — SOLO PARA DEMO DE SQL INJECTION  ⚠️⚠️⚠️
    // NUNCA usar en producción. Aquí se concatena el input del usuario directamente
    // en el texto del SQL y se ejecuta con sql.unsafe(), desactivando la
    // parametrización que normalmente protege contra inyección.
    //
    // Compará con getFilteredCustomersData / la versión original de esta misma
    // función: allí `${`%${query}%`}` viaja como PARÁMETRO (seguro). Acá el valor
    // se interpola como TEXTO del query (inseguro).
    const columns =
      'id, title, director, genre, release_year, rating, duration_minutes, purchase_price, rental_price, status';
    // Query en UNA sola línea lógica: así el `--` de un payload comenta TODO lo
    // que sigue (incluidos ORDER BY / LIMIT) y la inyección UNION funciona limpia.
    const rawQuery =
      `SELECT ${columns} FROM movies ` +
      `WHERE title ILIKE '%${query}%' OR director ILIKE '%${query}%' OR genre ILIKE '%${query}%' OR rating ILIKE '%${query}%' OR status ILIKE '%${query}%' ` +
      `ORDER BY title ASC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    // console.log('SQL ejecutado:', rawQuery);
    const movies = await sql.unsafe<Movie[]>(rawQuery);
    // console.log('Fetched filtered movies:', movies.length, new Date().toISOString());
    return movies;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch movies.');
  }
}
