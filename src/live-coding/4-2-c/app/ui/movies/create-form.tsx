'use client';

import {
  type MovieFormErrors,
  validateMovie,
} from '@/model/validation';
import { Button } from '@/ui/button';
import {
  BanknotesIcon,
  ClockIcon,
  FilmIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import styles from './form.module.css';
import { createMovie } from '@/lib/actions';
import { toast } from 'sonner';

export default function CreateMovieForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<MovieFormErrors>({});
  const [isCreating, setIsCreating] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isCreating) return;

    const formData = new FormData(e.currentTarget);
    const movieData = {
      title: String(formData.get('title') ?? ''),
      director: String(formData.get('director') ?? ''),
      genre: String(formData.get('genre') ?? ''),
      release_year: Number(formData.get('release_year')),
      rating: String(formData.get('rating') ?? ''),
      duration_minutes: Number(formData.get('duration_minutes')),
      purchase_price: Math.round(Number(formData.get('purchase_price')) * 100),
      rental_price: Math.round(Number(formData.get('rental_price')) * 100),
      status: String(formData.get('status') ?? ''),
    };
    const validationResult = validateMovie(movieData);

    if (!validationResult.success) {
      setFieldErrors(validationResult.fieldErrors);
      setErrorMessage(validationResult.message);
      return;
    } else {
      toast.success('Movie created successfully!');
      router.push('/dashboard/movies');
      router.refresh();
    }

    setFieldErrors({});
    setErrorMessage(null);

    setIsCreating(true);
    try {
      const result = await createMovie(movieData);

      if (!result.success) {
        setFieldErrors(result.errors ?? {});
        setErrorMessage(result.message ?? 'Failed to save movie.');
      }
    } finally {
      setIsCreating(false);
    }

  }

  return (
    <form onSubmit={handleSubmit} aria-busy={isCreating}>
      <fieldset className={styles.container} disabled={isCreating}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Title
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter movie title"
              className={styles.input}
              aria-describedby="title-error"
            />
            <FilmIcon className={styles.icon} />
          </div>
          <FieldErrors id="title-error" errors={fieldErrors.title} />
        </div>

        <div className={styles.field}>
          <label htmlFor="director" className={styles.label}>
            Director
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="director"
              name="director"
              type="text"
              placeholder="Enter director"
              className={styles.input}
              aria-describedby="director-error"
            />
            <UserIcon className={styles.icon} />
          </div>
          <FieldErrors id="director-error" errors={fieldErrors.director} />
        </div>

        <div className={styles.gridTwoColumns}>
          <div className={styles.field}>
            <label htmlFor="genre" className={styles.label}>
              Genre
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="genre"
                name="genre"
                type="text"
                placeholder="Drama, action, comedy..."
                className={styles.input}
                aria-describedby="genre-error"
              />
              <TagIcon className={styles.icon} />
            </div>
            <FieldErrors id="genre-error" errors={fieldErrors.genre} />
          </div>

          <div className={styles.field}>
            <label htmlFor="rating" className={styles.label}>
              Rating
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="rating"
                name="rating"
                type="text"
                placeholder="PG-13"
                className={styles.input}
                aria-describedby="rating-error"
              />
              <TagIcon className={styles.icon} />
            </div>
            <FieldErrors id="rating-error" errors={fieldErrors.rating} />
          </div>
        </div>

        <div className={styles.gridThreeColumns}>
          <div className={styles.field}>
            <label htmlFor="release-year" className={styles.label}>
              Release year
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="release-year"
                name="release_year"
                type="number"
                placeholder="2024"
                className={styles.input}
                aria-describedby="release-year-error"
              />
              <ClockIcon className={styles.icon} />
            </div>
            <FieldErrors id="release-year-error" errors={fieldErrors.release_year} />
          </div>

          <div className={styles.field}>
            <label htmlFor="duration-minutes" className={styles.label}>
              Duration
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="duration-minutes"
                name="duration_minutes"
                type="number"
                placeholder="120"
                className={styles.input}
                aria-describedby="duration-minutes-error"
              />
              <ClockIcon className={styles.icon} />
            </div>
            <FieldErrors id="duration-minutes-error" errors={fieldErrors.duration_minutes} />
          </div>

          <div className={styles.field}>
            <label htmlFor="purchase-price" className={styles.label}>
              Purchase price
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="purchase-price"
                name="purchase_price"
                type="number"
                step="0.01"
                placeholder="12.99"
                className={styles.input}
                aria-describedby="purchase-price-error"
              />
              <BanknotesIcon className={styles.icon} />
            </div>
            <FieldErrors id="purchase-price-error" errors={fieldErrors.purchase_price} />
          </div>
        </div>

        <div className={styles.gridTwoColumns}>
          <div className={styles.field}>
            <label htmlFor="rental-price" className={styles.label}>
              Rental price
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="rental-price"
                name="rental_price"
                type="number"
                step="0.01"
                placeholder="4.99"
                className={styles.input}
                aria-describedby="rental-price-error"
              />
              <BanknotesIcon className={styles.icon} />
            </div>
            <FieldErrors id="rental-price-error" errors={fieldErrors.rental_price} />
          </div>

          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              className={styles.select}
              aria-describedby="status-error"
              defaultValue=""
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="available">Available</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <FieldErrors id="status-error" errors={fieldErrors.status} />
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {errorMessage ? (
            <p className={styles.error}>{errorMessage}</p>
          ) : null}
        </div>
        {isCreating && (
          <div className={styles.loadingOverlay} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <span className="sr-only">Creating movie...</span>
          </div>
        )}
      </fieldset>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          disabled={isCreating}
          onClick={() => router.push('/dashboard/movies')}
        >
          Cancel
        </button>
        <Button type="submit" disabled={isCreating} aria-disabled={isCreating}>
          Create Movie
        </Button>
      </div>
    </form>
  );
}

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p className={styles.error} key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}
