import { getCustomerSummariesData, getMovieSummariesData } from '@/model/data';
import Form from '@/ui/invoices/create-form';
import Breadcrumbs from '@/ui/breadcrumbs';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { can } from '@/lib/authorization';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {
  if (!(await can('invoices:create'))) redirect('/dashboard');

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
