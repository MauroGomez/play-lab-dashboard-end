import { clsx } from 'clsx';
import Link from 'next/link';
import { lusitana } from '@/ui/fonts';
import styles from './breadcrumbs.module.css';

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <ol className={clsx(lusitana.className, styles.list)}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={breadcrumb.active ? styles.active : styles.inactive}
          >
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbs.length - 1 ? (
              <span className={styles.separator}>/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
