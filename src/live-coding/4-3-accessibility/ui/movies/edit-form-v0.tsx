'use client';

import { updateMovie } from '@/lib/actions';
import { validateMovie, type MovieFormErrors } from '@/model/validation';
import type { Movie } from '@/model/definitions';
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
import { toast } from 'sonner';
import styles from '@/ui/movies/create-form.module.css';

export default function EditMovieForm({ movie }: { movie: Movie }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<MovieFormErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isUpdating) return;

    const formData = new FormData(e.currentTarget);
    const movieData = {
      title: formData.get('title'),
      director: formData.get('director'),
      genre: formData.get('genre'),
      release_year: Number(formData.get('release_year')),
      rating: formData.get('rating'),
      duration_minutes: Number(formData.get('duration_minutes')),
      purchase_price: Math.round(Number(formData.get('purchase_price')) * 100),
      rental_price: Math.round(Number(formData.get('rental_price')) * 100),
      status: formData.get('status')  // Returns null when no option is selected
    };
    const validationResult = validateMovie(movieData);

    if (!validationResult.success) {
      setFieldErrors(validationResult.fieldErrors);
      setErrorMessage(validationResult.message);
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);

    setIsUpdating(true);
    try {
      const result = await updateMovie(movie.id, movieData);

      if (!result.success) {
        setFieldErrors(result.errors ?? {});
        setErrorMessage(result.message ?? 'Failed to save movie.');
      } else {
        setTimeout(() => {
          toast.success('Movie updated successfully!');
        }, 500);
        router.push('/dashboard/movies');
        router.refresh();
      }
    } finally {
      setIsUpdating(false);
    }

  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className={styles.container} disabled={isUpdating}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Title
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="title"
              name="title"
              defaultValue={movie.title}
              type="text"
              placeholder="Enter movie title"
              className={styles.input}
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
              defaultValue={movie.director}
              type="text"
              placeholder="Enter director"
              className={styles.input}
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
                defaultValue={movie.genre}
                type="text"
                placeholder="Drama, action, comedy..."
                className={styles.input}
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
                defaultValue={movie.rating}
                type="text"
                placeholder="PG-13"
                className={styles.input}
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
                defaultValue={movie.release_year}
                type="number"
                placeholder="2024"
                className={styles.input}
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
                defaultValue={movie.duration_minutes}
                type="number"
                placeholder="120"
                className={styles.input}
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
                defaultValue={movie.purchase_price / 100}
                type="number"
                step="0.01"
                placeholder="12.99"
                className={styles.input}
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
                defaultValue={movie.rental_price / 100}
                type="number"
                step="0.01"
                placeholder="4.99"
                className={styles.input}
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
              defaultValue={movie.status}
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

        <div>
          {errorMessage ? (
            <p className={styles.error}>{errorMessage}</p>
          ) : null}
        </div>
        {isUpdating && (
          <div className={styles.loadingOverlay}>
            <span className={styles.spinner} />
          </div>
        )}
      </fieldset>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          disabled={isUpdating}
          onClick={() => router.push('/dashboard/movies')}
        >
          Cancel
        </button>
        <Button type="submit" disabled={isUpdating}>
          Edit Movie
        </Button>
      </div>
    </form>
  );
}

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id}>
      {errors?.map((error) => (
        <p className={styles.error} key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}
