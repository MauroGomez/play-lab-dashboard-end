import Link from 'next/link';
import NavLinks from '@/ui/dashboard/nav-links';
import AcmeLogo from '@/ui/acme-logo';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { authEnabled, signOut } from '@/auth';
import { can } from '@/lib/authorization';

export default async function SideNav() {
  // NavLinks is a client component: permissions are checked here (server) and passed as props
  const canReadInvoices = await can('invoices:read');
  const canReadMovies = await can('movies:read');
  const canReadCustomers = await can('customers:read');

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks
          canReadInvoices={canReadInvoices}
          canReadMovies={canReadMovies}
          canReadCustomers={canReadCustomers}
        />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        {authEnabled ?
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
              <ArrowRightStartOnRectangleIcon className="w-6" />
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
          :
          <Link href="/" className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <ArrowRightStartOnRectangleIcon className="w-6" />
            <div className="hidden md:block">Leave</div>
          </Link>}
      </div>
    </div>
  );
}
