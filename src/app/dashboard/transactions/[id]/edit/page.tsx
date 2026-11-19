import { getTransaction, getUserSummaries, getMovieSummaries } from '@/model/data';
import Breadcrumbs from '@/ui/breadcrumbs';
import Form from '@/ui/transactions/edit-form';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { can } from '@/lib/authorization';

export const metadata: Metadata = {
  title: 'Edit Transaction',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  if (!(await can('transactions:update'))) redirect('/dashboard');

  const params = await props.params;
  const id = params.id;
  const [transaction, users, movies] = await Promise.all([
    getTransaction(id),
    getUserSummaries(),
    getMovieSummaries(),
  ]);

  if (!transaction) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Purchases & Rentals', href: '/dashboard/transactions' },
          {
            label: 'Edit Transaction',
            href: `/dashboard/transactions/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form transaction={transaction} users={users} movies={movies} />
    </main>
  );
}
