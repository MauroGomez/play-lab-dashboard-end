import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/movies/form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Movie',
};

export default async function Page() {
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
