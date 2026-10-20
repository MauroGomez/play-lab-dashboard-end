import { getMovies } from '@/model/data';
import Header from '@/ui/header';
 
export default function MoviesPage() {
  const movies = getMovies();  
  return (
    <div>
      <Header title="Movies" />
      <div>
      {movies.map((movie) => (
        <div key={movie.id}>
          {movie.title} ({movie.year})
        </div>
      ))}
      </div>
    </div>
  );
};