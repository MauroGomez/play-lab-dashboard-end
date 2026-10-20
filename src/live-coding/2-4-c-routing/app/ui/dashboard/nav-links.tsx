import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  FilmIcon,
} from '@heroicons/react/24/outline';
import styles from './nav-links.module.css';

export default function NavLinks() {
  return (
    <>
      <a href="/dashboard" className={styles.link}>
        <HomeIcon className={styles.icon} />
        <p className={styles.label}>Home</p>
      </a>

      <a href="/dashboard/invoices" className={styles.link}>
        <DocumentDuplicateIcon className={styles.icon} />
        <p className={styles.label}>Invoices</p>
      </a>

      <a href="/dashboard/movies" className={styles.link}>
        <FilmIcon className={styles.icon} />
        <p className={styles.label}>Movies</p>
      </a>

      <a href="/dashboard/customers" className={styles.link}>
        <UserGroupIcon className={styles.icon} />
        <p className={styles.label}>Customers</p>
      </a>
    </>
  );
}
