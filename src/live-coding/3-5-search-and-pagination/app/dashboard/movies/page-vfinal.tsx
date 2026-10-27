import { getFilteredMovies, getMoviesPagesUncached } from '@/model/data';
import MoviesView from '@/ui/movies/view';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const movies = await getFilteredMovies(query, currentPage);
  const totalPages = await getMoviesPagesUncached(query);

  return (
    <MoviesView movies={movies} totalPages={totalPages} />
  );
}
