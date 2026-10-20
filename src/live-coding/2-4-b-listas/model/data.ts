import { Movie } from "./definitions";

const movies: Movie[] = [
    { id: '1', title: 'The Matrix', year: 1999 },
    { id: '2', title: 'Spirited Away', year: 2001 },
];
 
export function getMovies(): Movie[] {
    return movies;
}