import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import styles from './search.module.css';

export default function Search({ placeholder }: { placeholder: string }) {  
  return (
    <div className={styles.container}>
      <label htmlFor="search" className={styles.label}>
        Search
      </label>
      <input
        className={styles.input}
        placeholder={placeholder}                
      />
      <MagnifyingGlassIcon className={styles.icon} />
    </div>
  );
}
