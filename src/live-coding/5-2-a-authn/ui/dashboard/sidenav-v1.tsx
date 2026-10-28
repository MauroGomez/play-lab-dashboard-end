import Link from 'next/link';
import NavLinks from '@/ui/dashboard/nav-links';
import AcmeLogo from '@/ui/acme-logo';
import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { auth, signOut } from '@/auth';
import { can } from '@/lib/authorization';
import styles from './sidenav.module.css';

export default async function SideNav() {
  // NavLinks is a client component: permissions are checked here (server) and passed as props
  const canReadInvoices = await can('invoices:read');
  const canReadMovies = await can('movies:read');
  const canReadCustomers = await can('customers:read');
  const user = (await auth())?.user;

  return (
    <div className={styles.root}>
      <Link
        className={styles.logoLink}
        href="/"
      >
        <div className={styles.logo}>
          <AcmeLogo />
        </div>
      </Link>
      <div className={styles.nav}>
        <NavLinks
          canReadInvoices={canReadInvoices}
          canReadMovies={canReadMovies}
          canReadCustomers={canReadCustomers}
        />
        <div className={styles.spacer}></div>
        {user && (
          <div className={styles.userBox}>
            <UserCircleIcon className={styles.userIcon} aria-hidden="true" />
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userRole}>{user.role}</p>
            </div>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button
                title="Sign Out"
                aria-label="Sign Out"
                className={styles.signOutButton}
              >
                <ArrowRightStartOnRectangleIcon className={styles.signOutIcon} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
