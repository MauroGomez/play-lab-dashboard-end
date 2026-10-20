import Link from 'next/link';
import NavLinks from '@/ui/dashboard/nav-links';
import AcmeLogo from '@/ui/acme-logo';
import styles from './sidenav.module.css';

export default async function SideNav() {
  return (
    <div className={styles.root}>
      <a
        className={styles.logoLink}
        href="/"
      >
        <div className={styles.logo}>
          <AcmeLogo />
        </div>
      </a>
      <div className={styles.nav}>
        <NavLinks />
        <div className={styles.spacer}></div>        
      </div>
    </div>
  );
}
