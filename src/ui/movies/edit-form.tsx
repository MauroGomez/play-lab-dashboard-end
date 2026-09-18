'use client';

import { updateMovie, type MovieState } from '@/lib/actions';
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
import { useActionState } from 'react';
import styles from '@/ui/movies/create-form.module.css';

export default function EditMovieForm({ movie }: { movie: Movie }) {
  const router = useRouter();
  const initialState: MovieState = { message: null, errors: {} };
  const updateMovieWithId = updateMovie.bind(null, movie.id);
  const [state, formAction, isPending] = useActionState(
    updateMovieWithId,
    initialState,
  );

  return (
    <form action={formAction} aria-busy={isPending}>
      <fieldset className={styles.container} disabled={isPending}>
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
              aria-describedby="title-error"
            />
            <FilmIcon className={styles.icon} />
          </div>
          <FieldErrors id="title-error" errors={state.errors?.title} />
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
              aria-describedby="director-error"
            />
            <UserIcon className={styles.icon} />
          </div>
          <FieldErrors id="director-error" errors={state.errors?.director} />
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
                aria-describedby="genre-error"
              />
              <TagIcon className={styles.icon} />
            </div>
            <FieldErrors id="genre-error" errors={state.errors?.genre} />
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
                aria-describedby="rating-error"
              />
              <TagIcon className={styles.icon} />
            </div>
            <FieldErrors id="rating-error" errors={state.errors?.rating} />
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
                name="releaseYear"
                defaultValue={movie.release_year}
                type="number"
                placeholder="2024"
                className={styles.input}
                aria-describedby="release-year-error"
              />
              <ClockIcon className={styles.icon} />
            </div>
            <FieldErrors id="release-year-error" errors={state.errors?.releaseYear} />
          </div>

          <div className={styles.field}>
            <label htmlFor="duration-minutes" className={styles.label}>
              Duration
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="duration-minutes"
                name="durationMinutes"
                defaultValue={movie.duration_minutes}
                type="number"
                placeholder="120"
                className={styles.input}
                aria-describedby="duration-minutes-error"
              />
              <ClockIcon className={styles.icon} />
            </div>
            <FieldErrors id="duration-minutes-error" errors={state.errors?.durationMinutes} />
          </div>

          <div className={styles.field}>
            <label htmlFor="purchase-price" className={styles.label}>
              Purchase price
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="purchase-price"
                name="purchasePrice"
                defaultValue={movie.purchase_price / 100}
                type="number"
                step="0.01"
                placeholder="12.99"
                className={styles.input}
                aria-describedby="purchase-price-error"
              />
              <BanknotesIcon className={styles.icon} />
            </div>
            <FieldErrors id="purchase-price-error" errors={state.errors?.purchasePrice} />
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
                name="rentalPrice"
                defaultValue={movie.rental_price / 100}
                type="number"
                step="0.01"
                placeholder="4.99"
                className={styles.input}
                aria-describedby="rental-price-error"
              />
              <BanknotesIcon className={styles.icon} />
            </div>
            <FieldErrors id="rental-price-error" errors={state.errors?.rentalPrice} />
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
              defaultValue={movie.status}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="available">Available</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <FieldErrors id="status-error" errors={state.errors?.status} />
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className={styles.error}>{state.message}</p>
          ) : null}
        </div>
        {isPending && (
          <div className={styles.loadingOverlay} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <span className="sr-only">Saving movie...</span>
          </div>
        )}
      </fieldset>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          disabled={isPending}
          onClick={() => router.push('/dashboard/movies')}
        >
          Cancel
        </button>
        <Button type="submit" disabled={isPending} aria-disabled={isPending}>
          Edit Movie
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
