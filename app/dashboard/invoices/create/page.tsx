import { fetchCustomers, fetchMovies } from '@/app/lib/data';
import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {
  const [customers, movies] = await Promise.all([
    fetchCustomers(),
    fetchMovies(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} movies={movies} />
    </main>
  );
}
