import { getFilteredMoviesData } from '@/model/data';
import MoviesView from '@/ui/movies/view';

export default async function Page() {
  const movies = await getFilteredMoviesData();

  return (
    <MoviesView movies={movies} />
  );
}

