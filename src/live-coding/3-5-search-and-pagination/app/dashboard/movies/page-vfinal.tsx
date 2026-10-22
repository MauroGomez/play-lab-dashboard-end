import { getFilteredMoviesData, getMoviesPagesDataUncached } from '@/model/data';
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

  const movies = await getFilteredMoviesData(query, currentPage);
  const totalPages = await getMoviesPagesDataUncached(query);

  return (
    <MoviesView movies={movies} totalPages={totalPages} />
  );
}
