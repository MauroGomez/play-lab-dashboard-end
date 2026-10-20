import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteMovie } from '@/lib/actions';
import styles from './buttons.module.css';

export function CreateMovie() {
  return (
    <Link
      href="/dashboard/movies/create"
      className={styles.createButton}
    >
      <span className={styles.createLabel}>Create Movie</span>{' '}
      <PlusIcon className={styles.createIcon} />
    </Link>
  );
}

export function UpdateMovie({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/movies/${id}/edit`}
      className={styles.actionButton}
    >
      <span className={styles.srOnly}>Edit</span>
      <PencilIcon className={styles.actionIcon} />
    </Link>
  );
}

export function DeleteMovie({ id }: { id: string }) {
  const deleteMovieWithId = deleteMovie.bind(null, id);

  return (
    <form action={deleteMovieWithId}>
      <button type="submit" className={styles.actionButton}>
        <span className={styles.srOnly}>Delete</span>
        <TrashIcon className={styles.actionIcon} />
      </button>
    </form>
  );
}
