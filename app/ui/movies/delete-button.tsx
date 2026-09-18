'use client';

import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ConfirmationModal } from '@/app/ui/confirmation-modal';
import styles from './delete-button.module.css';
import { deleteMovie } from '@/app/lib/actions';

export default function DeleteMovieButton({ id }: { id: string }) {    
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    function handleDeleteClick() {
        setIsConfirmOpen(true);
    }

    async function handleConfirm() {
        setIsConfirmOpen(false);
        setIsDeleting(true);
        try {            
            await deleteMovie(id);            
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
