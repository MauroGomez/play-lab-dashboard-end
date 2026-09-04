'use client';

import type { MovieStatus } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import {
  BanknotesIcon,
  ClockIcon,
  FilmIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { FormEvent, ReactNode } from 'react';
import styles from './form.module.css';
import { useRouter } from 'next/navigation';

export default function CreateMovieForm() {
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      status: String(formData.get('status') ?? '') as MovieStatus,
    };

    await fetch('/live-coding/3-2/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    });

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
          icon={<FilmIcon className={styles.icon} />}
        />

        <TextField
          id="director"
          label="Director"
          name="director"
          placeholder="Enter director"
          icon={<UserIcon className={styles.icon} />}
        />

        <div className={styles.gridTwoColumns}>
          <TextField
            id="genre"
            label="Genre"
            name="genre"
            placeholder="Drama, action, comedy..."
            icon={<TagIcon className={styles.icon} />}
          />

          <TextField
            id="rating"
            label="Rating"
            name="rating"
            placeholder="PG-13"
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
            icon={<ClockIcon className={styles.icon} />}
          />

          <TextField
            id="duration-minutes"
            label="Duration"
            name="duration_minutes"
            type="number"
            placeholder="120"
            icon={<ClockIcon className={styles.icon} />}
          />

          <TextField
            id="purchase-price"
            label="Purchase price"
            name="purchase_price"
            type="number"
            step="0.01"
            placeholder="12.99"
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
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="available">Available</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
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
  icon,
  type = 'text',
  step,
}: {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string | number;
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
    </div>
  );
}
