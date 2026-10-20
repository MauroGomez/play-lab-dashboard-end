import EditMovieView from '@/live-coding/2-4-e-arquitectura/ui/movies/edit-view';
import { getMovieData } from '@/model/data';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const movie = await getMovieData(params.id);
  return (
    <EditMovieView movie={movie} />
  );
};