import { getMovies } from "@/model/data";
import Header from "@/ui/header";

export default function MoviesPage() {
  const movies = getMovies();
  const message = `Aquí verás ${movies.length} películas`;
  return (
    <div>
      <Header title="Movies" />
      <div>{message}</div>
    </div>
  );
};
