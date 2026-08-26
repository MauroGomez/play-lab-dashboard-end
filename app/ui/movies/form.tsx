'use client';

import { MovieForm } from '@/app/lib/definitions';
import { createMovie, MovieState, updateMovie } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import {
  BanknotesIcon,
  ClockIcon,
  FilmIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useActionState } from 'react';

export default function MovieEditorForm({ movie }: { movie?: MovieForm }) {
  const initialState: MovieState = { message: null, errors: {} };
  const action = movie ? updateMovie.bind(null, movie.id) : createMovie;
  const [state, formAction] = useActionState(action, initialState);
  const isEditing = Boolean(movie);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <TextField
          id="title"
          label="Title"
          name="title"
          placeholder="Enter movie title"
          defaultValue={movie?.title}
          errors={state.errors?.title}
          icon={<FilmIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
        />

        <TextField
          id="director"
          label="Director"
          name="director"
          placeholder="Enter director"
          defaultValue={movie?.director}
          errors={state.errors?.director}
          icon={<UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            id="genre"
            label="Genre"
            name="genre"
            placeholder="Drama, action, comedy..."
            defaultValue={movie?.genre}
            errors={state.errors?.genre}
            icon={<TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
          />

          <TextField
            id="rating"
            label="Rating"
            name="rating"
            placeholder="PG-13"
            defaultValue={movie?.rating}
            errors={state.errors?.rating}
            icon={<TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            id="release-year"
            label="Release year"
            name="releaseYear"
            type="number"
            placeholder="2024"
            defaultValue={movie?.release_year}
            errors={state.errors?.releaseYear}
            icon={<ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
          />

          <TextField
            id="duration-minutes"
            label="Duration"
            name="durationMinutes"
            type="number"
            placeholder="120"
            defaultValue={movie?.duration_minutes}
            errors={state.errors?.durationMinutes}
            icon={<ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
          />

          <TextField
            id="purchase-price"
            label="Purchase price"
            name="purchasePrice"
            type="number"
            step="0.01"
            placeholder="12.99"
            defaultValue={
              movie ? (movie.purchase_price / 100).toFixed(2) : undefined
            }
            errors={state.errors?.purchasePrice}
            icon={<BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            id="rental-price"
            label="Rental price"
            name="rentalPrice"
            type="number"
            step="0.01"
            placeholder="4.99"
            defaultValue={
              movie ? (movie.rental_price / 100).toFixed(2) : undefined
            }
            errors={state.errors?.rentalPrice}
            icon={<BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />}
          />

          <div className="mb-4">
            <label htmlFor="status" className="mb-2 block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={movie?.status ?? ''}
              aria-describedby="status-error"
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
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/movies"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">{isEditing ? 'Edit Movie' : 'Create Movie'}</Button>
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
  icon: React.ReactNode;
  type?: string;
  step?: string;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          step={step}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
        <p className="mt-2 text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}
