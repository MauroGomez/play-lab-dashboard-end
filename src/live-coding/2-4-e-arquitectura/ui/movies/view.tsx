import { Movie } from '@/model/definitions';
import Header from "@/ui/header";
import MoviesTable from '@/ui/movies/table';
 
export default function MoviesView({ movies }: { movies: Movie[] }) {  
  return (
    <div>
      <Header title="Movies" />
      <MoviesTable movies={movies} />
    </div>
  );    
};