import { lusitana } from "@/ui/fonts";
import { CreateMovie } from "@/ui/movies/buttons";
import MoviesTable from "@/ui/movies/table";
import Search from "@/ui/search";
import styles from "./view.module.css";
import Pagination from "@/ui/pagination";
import { Suspense } from "react";
import { MoviesTableSkeleton } from "@/ui/skeletons";
import { can } from '@/lib/authorization';

export default async function MoviesView({ query, currentPage, totalPages }: { query: string; currentPage: number; totalPages: number }) {
    const canCreate = await can('movies:create');
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={`${lusitana.className} ${styles.title}`}>Movies</h1>
            </div>
            <div className={styles.toolbar}>
                <Search placeholder="Search movies..." />
                {canCreate && <CreateMovie />}
            </div>
            <Suspense key={query + currentPage} fallback={<MoviesTableSkeleton/>}>
                <MoviesTable query={query} currentPage={currentPage} />
            </Suspense>
            <div className={styles.pagination}>
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
