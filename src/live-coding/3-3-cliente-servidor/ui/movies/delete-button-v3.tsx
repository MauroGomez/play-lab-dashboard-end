'use client';

import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmationModal } from '@/ui/confirmation-modal';
import styles from './delete-button.module.css';

export default function DeleteMovieButton({ id }: { id: string }) {
    const router = useRouter();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    function handleDeleteClick() {
        setIsConfirmOpen(true);
    }

    async function handleConfirm() {
        setIsConfirmOpen(false);
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/movies/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete movie');
            }
            router.refresh();
        } catch (error) {
            setIsDeleting(false);
            console.error('Error deleting movie:', error);
        }
    }

    function handleCancel() {
        setIsConfirmOpen(false);
    }

    return (
        <>
            <button
                type="button"
                className={styles.button}
                onClick={handleDeleteClick}
                disabled={isDeleting}
            >
                {isDeleting ? (
                    <ArrowPathIcon className={styles.spinner} />
                ) : (
                    <TrashIcon className={styles.icon} />
                )}
            </button>

            {isConfirmOpen && (
                <ConfirmationModal
                    title="Delete movie"
                    message="Are you sure you want to delete this movie?"
                    confirmLabel="Delete"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
}
