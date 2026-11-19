import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  FilmIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from './nav-links.module.css';

export default function NavLinks() {
  return (
    <>
      <Link href="/dashboard" className={styles.link}>
        <HomeIcon className={styles.icon} />
        <p className={styles.label}>Home</p>
      </Link>

      <Link href="/dashboard/transactions" className={styles.link}>
        <DocumentDuplicateIcon className={styles.icon} />
        <p className={styles.label}>Purchases &amp; Rentals</p>
      </Link>

      <Link href="/dashboard/movies" className={styles.link}>
        <FilmIcon className={styles.icon} />
        <p className={styles.label}>Movies</p>
      </Link>

      <Link href="/dashboard/users" className={styles.link}>
        <UserGroupIcon className={styles.icon} />
        <p className={styles.label}>Users</p>
      </Link>
    </>
  );
}
