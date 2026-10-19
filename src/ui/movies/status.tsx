import clsx from 'clsx';
import styles from './status.module.css';

const labels = {
  available: 'Available',
  draft: 'Draft',
  archived: 'Archived',
};

export default function MovieStatus({
  status,
}: {
  status: 'available' | 'draft' | 'archived';
}) {
  return (
    <span
      className={clsx(styles.status, styles[status])}
    >
      {labels[status]}
    </span>
  );
}
