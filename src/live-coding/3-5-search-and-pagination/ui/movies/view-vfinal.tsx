import { Movie } from "@/model/definitions";
import { lusitana } from "@/ui/fonts";
import { CreateMovie } from "@/ui/movies/buttons";
import MoviesTable from "@/ui/movies/table";
import Search from "@/ui/search";
import styles from "./view.module.css";
import Pagination from "@/ui/pagination";

export default function MoviesView({ movies, totalPages }: { movies: Movie[]; totalPages: number }) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={`${lusitana.className} ${styles.title}`}>Movies</h1>
            </div>
            <div className={styles.toolbar}>
                <Search placeholder="Search movies..." />
                <CreateMovie />
            </div>
            <MoviesTable movies={movies} />
            <div className={styles.pagination}>
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
