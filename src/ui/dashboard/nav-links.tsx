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

  // Map of links to display in the side navigation.
  // Depending on the size of the application, this would be stored in a database.
  const links = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon, visible: true },
    {
      name: 'Invoices',
      href: '/dashboard/invoices',
      icon: DocumentDuplicateIcon,
      visible: canReadInvoices,
    },
    {
      name: 'Movies',
      href: '/dashboard/movies',
      icon: FilmIcon,
      visible: canReadMovies,
    },
    {
      name: 'Customers',
      href: '/dashboard/customers',
      icon: UserGroupIcon,
      visible: canReadCustomers,
    },
  ];
  const visibleLinks = links.filter((link) => link.visible);

  return (
    <>
      {visibleLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              styles.link,
              pathname === link.href && styles.active              
            )}
          >
            <LinkIcon className={styles.icon} />
            <p className={styles.label}>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
