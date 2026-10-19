import { PlayIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/ui/fonts';
import styles from './acme-logo.module.css';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} ${styles.logo}`}
    >
      <PlayIcon className={styles.icon} />
      <p className={styles.text}>Lab</p>
    </div>
  );
}
