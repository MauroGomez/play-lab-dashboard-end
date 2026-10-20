import { Movie } from "@/model/definitions";
import Header from "@/ui/header";
import Form from '@/ui/movies/edit-form';

export default function EditMovieView({ movie }: { movie: Movie }) {
  return (
    <div>
      <Header title="Edit Movie" />
      <Form movie={movie} />
    </div>
  );
};