import { getUserSummaries, getMovieSummaries } from '@/model/data';
import Form from '@/ui/transactions/create-form';
import Breadcrumbs from '@/ui/breadcrumbs';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { can } from '@/lib/authorization';

export const metadata: Metadata = {
  title: 'Create Transaction',
};

export default async function Page() {
  if (!(await can('transactions:create'))) redirect('/dashboard');

  const [users, movies] = await Promise.all([
    getUserSummaries(),
    getMovieSummaries(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Purchases & Rentals', href: '/dashboard/transactions' },
          {
            label: 'Create Transaction',
            href: '/dashboard/transactions/create',
            active: true,
          },
        ]}
      />
      <Form users={users} movies={movies} />
    </main>
  );
}
