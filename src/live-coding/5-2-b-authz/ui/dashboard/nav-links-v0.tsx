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

export default function NavLinks() {
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

      <Link
        href="/dashboard/transactions"
        className={clsx(
          styles.link,
          pathname === '/dashboard/transactions' && styles.active,
        )}
      >
        <DocumentDuplicateIcon className={styles.icon} />
        <p className={styles.label}>Purchases &amp; Rentals</p>
      </Link>

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

      <Link
        href="/dashboard/users"
        className={clsx(
          styles.link,
          pathname === '/dashboard/users' && styles.active,
        )}
      >
        <UserGroupIcon className={styles.icon} />
        <p className={styles.label}>Users</p>
      </Link>
    </>
  );
}
