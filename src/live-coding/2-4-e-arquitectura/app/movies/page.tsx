import { getMoviesData } from '@/model/data';
import MoviesView from '@/ui/movies/view';

export default function MoviesPage() {
    const movies = getMoviesData();       // Fetches data from the model  
    return (
        <MoviesView movies={movies} />  // Passes data to the view for rendering
    );
};