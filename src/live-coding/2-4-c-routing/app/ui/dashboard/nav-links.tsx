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

      <a href="/dashboard/transactions" className={styles.link}>
        <DocumentDuplicateIcon className={styles.icon} />
        <p className={styles.label}>Purchases &amp; Rentals</p>
      </a>

      <a href="/dashboard/movies" className={styles.link}>
        <FilmIcon className={styles.icon} />
        <p className={styles.label}>Movies</p>
      </a>

      <a href="/dashboard/users" className={styles.link}>
        <UserGroupIcon className={styles.icon} />
        <p className={styles.label}>Users</p>
      </a>
    </>
  );
}
