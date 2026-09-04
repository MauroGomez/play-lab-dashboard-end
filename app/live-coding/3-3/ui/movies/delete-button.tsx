'use client';

import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmationModal } from '../confirmation-modal';
import styles from './delete-button.module.css';

export function DeleteMovieButton({ id }: { id: string }) {
    const router = useRouter();

    async function handleDeleteClick() {
        await fetch(`/live-coding/3-2/api/movies/${id}`, {
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

export function DeleteMovieConfirmButton({ id }: { id: string }) {
    const router = useRouter();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    function handleDeleteClick() {
        setIsConfirmOpen(true);
    }

    async function handleConfirm() {
        setIsConfirmOpen(false);

        await fetch(`/live-coding/3-2/api/movies/${id}`, {
            method: 'DELETE',
        });

        router.refresh();
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
            >
                <TrashIcon className={styles.icon} />
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

/**
 * A button that allows the user to delete a movie with a confirmation dialog and a loading state.
 */

export function DeleteMovieConfirmLoadingButton({ id }: { id: string }) {
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
            const response = await fetch(`/live-coding/3-2/api/movies/${id}`, {
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
