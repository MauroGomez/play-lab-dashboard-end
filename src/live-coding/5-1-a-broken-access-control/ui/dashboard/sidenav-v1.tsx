import Link from 'next/link';
import NavLinks from '@/ui/dashboard/nav-links';
import AcmeLogo from '@/ui/acme-logo';
import { can } from '@/lib/authorization';
import styles from './sidenav.module.css';

export default async function SideNav() {
  // NavLinks is a client component: permissions are checked here (server) and passed as props
  const canReadInvoices = await can('invoices:read');
  const canReadMovies = await can('movies:read');
  const canReadCustomers = await can('customers:read');

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
      </div>
    </div>
  );
}
