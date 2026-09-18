'use client';

import styles from './confirmation-modal.module.css';

type ConfirmationModalProps = {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationModal({
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <div className={styles.backdrop}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-message"
      >
        <h2 id="confirmation-modal-title" className={styles.title}>
          {title}
        </h2>
        <p id="confirmation-modal-message" className={styles.message}>
          {message}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
