import { Toaster } from 'sonner';
import SideNav from '@/ui/dashboard/sidenav';
import styles from './layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <SideNav />
      </div>
      <div className={styles.content}>{children}</div>
      <Toaster position="top-right" />
    </div>
  );
}
