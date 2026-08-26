import { fetchInvoiceById, fetchCustomers, fetchMovies } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/invoices/edit-form';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers, movies] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
    fetchMovies(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} movies={movies} />
    </main>
  );
}
