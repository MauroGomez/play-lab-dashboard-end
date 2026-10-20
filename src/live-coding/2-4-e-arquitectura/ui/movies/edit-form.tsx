import type { Movie } from '@/model/definitions';
import { Button } from '@/ui/button';
import {
  BanknotesIcon,
  ClockIcon,
  FilmIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from './create-form.module.css';

export default function EditMovieForm({ movie }: { movie: Movie }) {
  return (
    <form>
      <fieldset className={styles.container}>
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
              />
              <ClockIcon className={styles.icon} />
            </div>
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
              />
              <ClockIcon className={styles.icon} />
            </div>
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
              />
              <BanknotesIcon className={styles.icon} />
            </div>
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
              />
              <BanknotesIcon className={styles.icon} />
            </div>
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
          </div>
        </div>
      </fieldset>
      <div className={styles.actions}>
        <Link href="/dashboard/movies" className={styles.cancelButton}>
          Cancel
        </Link>
        <Button type="submit">
          Edit Movie
        </Button>
      </div>
    </form>
  );
}
