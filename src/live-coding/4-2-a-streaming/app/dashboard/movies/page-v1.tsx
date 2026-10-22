import { getMoviesPagesDataUncached } from '@/model/data';
import MoviesView from '@/ui/movies/view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movies',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await getMoviesPagesDataUncached(query);

  return (
    <MoviesView query={query} currentPage={currentPage} totalPages={totalPages} />
  );
}
