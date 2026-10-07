import { getFilteredCustomersData } from '@/model/data';
import CustomersTable from '@/ui/customers/table';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { can } from '@/lib/authorization';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  if (!(await can('customers:read'))) redirect('/dashboard');

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  const customers = await getFilteredCustomersData(query);

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}
