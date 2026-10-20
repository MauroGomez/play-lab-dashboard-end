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

      <Link href="/dashboard/invoices" className={styles.link}>
        <DocumentDuplicateIcon className={styles.icon} />
        <p className={styles.label}>Invoices</p>
      </Link>

      <Link href="/dashboard/movies" className={styles.link}>
        <FilmIcon className={styles.icon} />
        <p className={styles.label}>Movies</p>
      </Link>

      <Link href="/dashboard/customers" className={styles.link}>
        <UserGroupIcon className={styles.icon} />
        <p className={styles.label}>Customers</p>
      </Link>
    </>
  );
}
