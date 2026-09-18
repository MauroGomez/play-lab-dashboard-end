import { getCustomerSummariesData, getMovieSummariesData } from '@/model/data';
import Form from '@/ui/invoices/create-form';
import Breadcrumbs from '@/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {
  const [customers, movies] = await Promise.all([
    getCustomerSummariesData(),
    getMovieSummariesData(),
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
