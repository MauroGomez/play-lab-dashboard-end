import { getMovieData } from '@/model/data';
import Breadcrumbs from '@/ui/breadcrumbs';
import Form from '@/ui/movies/create-form';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Movie',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const movie = await getMovieData(params.id);

  if (!movie) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Movies', href: '/dashboard/movies' },
          {
            label: 'Edit Movie',
            href: `/dashboard/movies/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form movie={movie} />
    </main>
  );
}
