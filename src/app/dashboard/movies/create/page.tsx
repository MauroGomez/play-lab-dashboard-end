import Breadcrumbs from '@/ui/breadcrumbs';
import Form from '@/ui/movies/create-form';
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
