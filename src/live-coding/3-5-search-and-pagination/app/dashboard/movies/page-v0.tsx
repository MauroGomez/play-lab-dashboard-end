import { getFilteredMovies } from '@/model/data';
import MoviesView from '@/ui/movies/view';

export default async function Page() {
  const movies = await getFilteredMovies();

  return (
    <MoviesView movies={movies} />
  );
}

