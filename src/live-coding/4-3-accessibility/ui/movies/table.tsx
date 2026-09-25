import { formatCurrency } from '@/lib/utils';
import { UpdateMovie } from '@/ui/movies/buttons';
import DeleteMovieButton from '@/ui/movies/delete-button';
import MovieStatus from '@/ui/movies/status';
import styles from './table.module.css';
import { Movie } from '@/model/definitions';

export default async function MoviesTable({
  movies
}: {
  movies: Movie[];
}) {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.surface}>
          <div className={styles.mobileList}>
            {movies.map((movie) => (
              <div key={movie.id} className={styles.mobileCard}>
                <div className={styles.mobileHeader}>
                  <div>
                    <p className={styles.title}>{movie.title}</p>
                    <p className={styles.mobileDirector}>{movie.director}</p>
                  </div>
                  <MovieStatus status={movie.status} />
                </div>
                <div className={styles.mobileDetails}>
                  <div className={styles.mobileMetadata}>
                    <p>
                      {movie.genre} · {movie.release_year}
                    </p>
                    <p className={styles.mutedText}>
                      Buy {formatCurrency(movie.purchase_price)} · Rent{' '}
                      {formatCurrency(movie.rental_price)}
                    </p>
                  </div>
                  <div className={styles.actions}>
                    <UpdateMovie id={movie.id} />
                    <DeleteMovieButton id={movie.id} title={movie.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th scope="col" className={styles.titleHeader}>
                  Title
                </th>
                <th scope="col" className={styles.header}>
                  Director
                </th>
                <th scope="col" className={styles.header}>
                  Genre
                </th>
                <th scope="col" className={styles.header}>
                  Year
                </th>
                <th scope="col" className={styles.header}>
                  Prices
                </th>
                <th scope="col" className={styles.header}>
                  Status
                </th>
                <th scope="col" className={styles.actionsHeader}>
                  <span className={styles.srOnly}>Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {movies.map((movie) => (
                <tr key={movie.id} className={styles.row}>
                  <td className={styles.titleCell}>
                    <p className={styles.title}>{movie.title}</p>
                    <p className={styles.smallMutedText}>
                      {/* {movie.rating + " · "  + movie.duration_minutes + " min"} */}
                      {movie.rating} · {movie.duration_minutes} min
                    </p>
                  </td>
                  <td className={styles.cell}>{movie.director}</td>
                  <td className={styles.cell}>{movie.genre}</td>
                  <td className={styles.cell}>
                    {movie.release_year}
                  </td>
                  <td className={styles.cell}>
                    <p>{formatCurrency(movie.purchase_price)}</p>
                    <p className={styles.smallMutedText}>
                      Rental {formatCurrency(movie.rental_price)}
                    </p>
                  </td>
                  <td className={styles.cell}>
                    <MovieStatus status={movie.status} />
                  </td>
                  <td className={styles.actionsCell}>
                    <div className={styles.tableActions}>
                      <UpdateMovie id={movie.id} />
                      <DeleteMovieButton id={movie.id} title={movie.title}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
