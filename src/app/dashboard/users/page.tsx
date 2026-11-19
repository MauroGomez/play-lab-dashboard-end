import { getFilteredUsers } from '@/model/data';
import UsersTable from '@/ui/users/table';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { can } from '@/lib/authorization';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  if (!(await can('users:read'))) redirect('/dashboard');

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  const users = await getFilteredUsers(query);

  return (
    <main>
      <UsersTable users={users} />
    </main>
  );
}
