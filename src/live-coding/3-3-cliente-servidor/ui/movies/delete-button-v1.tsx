'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import styles from './delete-button.module.css';

export default function DeleteMovieButton({ id }: { id: string }) {
    const router = useRouter();

    async function handleDeleteClick() {
        await fetch(`/api/movies/${id}`, {
            method: 'DELETE',
        });

        router.refresh();
    }

    return (
        <button
            type="button"
            className={styles.button}
            onClick={handleDeleteClick}
        >
            <TrashIcon className={styles.icon} />
        </button>
    );
}
