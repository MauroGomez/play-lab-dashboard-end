'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  FilmIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import styles from './nav-links.module.css';

export default function NavLinks({
  canReadInvoices,
  canReadMovies,
  canReadCustomers,
}: {
  canReadInvoices: boolean;
  canReadMovies: boolean;
  canReadCustomers: boolean;
}) {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/dashboard"
        className={clsx(styles.link, pathname === '/dashboard' && styles.active)}
      >
        <HomeIcon className={styles.icon} />
        <p className={styles.label}>Home</p>
      </Link>

      {canReadInvoices && (
        <Link
          href="/dashboard/invoices"
          className={clsx(
            styles.link,
            pathname === '/dashboard/invoices' && styles.active,
          )}
        >
          <DocumentDuplicateIcon className={styles.icon} />
          <p className={styles.label}>Invoices</p>
        </Link>
      )}

      {canReadMovies && (
        <Link
          href="/dashboard/movies"
          className={clsx(
            styles.link,
            pathname === '/dashboard/movies' && styles.active,
          )}
        >
          <FilmIcon className={styles.icon} />
          <p className={styles.label}>Movies</p>
        </Link>
      )}

      {canReadCustomers && (
        <Link
          href="/dashboard/customers"
          className={clsx(
            styles.link,
            pathname === '/dashboard/customers' && styles.active,
          )}
        >
          <UserGroupIcon className={styles.icon} />
          <p className={styles.label}>Customers</p>
        </Link>
      )}
    </>
  );
}
