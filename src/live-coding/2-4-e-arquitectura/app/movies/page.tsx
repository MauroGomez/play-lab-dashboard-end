import { getMovies } from '@/model/data';
import MoviesView from '@/ui/movies/view';

export default function MoviesPage() {
    const movies = getMovies();       // Fetches data from the model
    return (
        <MoviesView movies={movies} />  // Passes data to the view for rendering
    );
};