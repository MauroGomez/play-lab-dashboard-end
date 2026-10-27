import { getMoviesPagesUncached } from '@/model/data';
import MoviesView from '@/ui/movies/view';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { can } from '@/lib/authorization';

export const metadata: Metadata = {
  title: 'Movies',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  if (!(await can('movies:read'))) redirect('/dashboard');

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await getMoviesPagesUncached(query);

  return (
    <MoviesView query={query} currentPage={currentPage} totalPages={totalPages} />
  );
}
