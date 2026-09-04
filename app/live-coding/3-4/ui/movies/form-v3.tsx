'use client';

import {
  type MovieFormErrors,
  validateMovie,
} from '@/app/live-coding/3-4/model/validation';
import { Button } from '@/app/ui/button';
import {
  BanknotesIcon,
  ClockIcon,
  FilmIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import styles from './form.module.css';

export default function CreateMovieForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<MovieFormErrors>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawMovieData = Object.fromEntries(formData.entries());
    const validationResult = validateMovie(rawMovieData);

    if (!validationResult.success) {
      setFieldErrors(validationResult.fieldErrors);
      setErrorMessage(validationResult.message);
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);

    const response = await fetch('/live-coding/3-4/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rawMovieData),
    });

    if (!response.ok) {
      setErrorMessage('Failed to save movie.');
      return;
    }

    router.push('/dashboard/movies');
    router.refresh();

  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.container}>
        <TextField
          id="title"
          label="Title"
          name="title"
          placeholder="Enter movie title"
          errors={fieldErrors.title}
          icon={<FilmIcon className={styles.icon} />}
        />

        <TextField
          id="director"
          label="Director"
          name="director"
          placeholder="Enter director"
          errors={fieldErrors.director}
          icon={<UserIcon className={styles.icon} />}
        />

        <div className={styles.gridTwoColumns}>
          <TextField
            id="genre"
            label="Genre"
            name="genre"
            placeholder="Drama, action, comedy..."
            errors={fieldErrors.genre}
            icon={<TagIcon className={styles.icon} />}
          />

          <TextField
            id="rating"
            label="Rating"
            name="rating"
            placeholder="PG-13"
            errors={fieldErrors.rating}
            icon={<TagIcon className={styles.icon} />}
          />
        </div>

        <div className={styles.gridThreeColumns}>
          <TextField
            id="release-year"
            label="Release year"
            name="release_year"
            type="number"
            placeholder="2024"
            errors={fieldErrors.release_year}
            icon={<ClockIcon className={styles.icon} />}
          />

          <TextField
            id="duration-minutes"
            label="Duration"
            name="duration_minutes"
            type="number"
            placeholder="120"
            errors={fieldErrors.duration_minutes}
            icon={<ClockIcon className={styles.icon} />}
          />

          <TextField
            id="purchase-price"
            label="Purchase price"
            name="purchase_price"
            type="number"
            step="0.01"
            placeholder="12.99"
            errors={fieldErrors.purchase_price}
            icon={<BanknotesIcon className={styles.icon} />}
          />
        </div>

        <div className={styles.gridTwoColumns}>
          <TextField
            id="rental-price"
            label="Rental price"
            name="rental_price"
            type="number"
            step="0.01"
            placeholder="4.99"
            errors={fieldErrors.rental_price}
            icon={<BanknotesIcon className={styles.icon} />}
          />

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
      </div>
      <div className={styles.actions}>
        <Link
          href="/dashboard/movies"
          className={styles.cancelLink}
        >
          Cancel
        </Link>
        <Button type="submit">{'Create Movie'}</Button>
      </div>
    </form>
  );
}

function TextField({
  id,
  label,
  name,
  placeholder,
  defaultValue,
  errors,
  icon,
  type = 'text',
  step,
}: {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string | number;
  errors?: string[];
  icon: ReactNode;
  type?: string;
  step?: string;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          name={name}
          type={type}
          step={step}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={styles.input}
          aria-describedby={`${id}-error`}
        />
        {icon}
      </div>
      <FieldErrors id={`${id}-error`} errors={errors} />
    </div>
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
