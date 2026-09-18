import clsx from 'clsx';

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
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        {
          'bg-green-500 text-white': status === 'available',
          'bg-gray-100 text-gray-600': status === 'draft',
          'bg-red-100 text-red-700': status === 'archived',
        },
      )}
    >
      {labels[status]}
    </span>
  );
}
