import Breadcrumbs from '@/ui/breadcrumbs';
import Form from '@/ui/movies/create-form';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { can } from '@/lib/authorization';

export const metadata: Metadata = {
  title: 'Create Movie',
};

export default async function Page() {
  if (!(await can('movies:create'))) redirect('/dashboard');

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Movies', href: '/dashboard/movies' },
          {
            label: 'Create Movie',
            href: '/dashboard/movies/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
