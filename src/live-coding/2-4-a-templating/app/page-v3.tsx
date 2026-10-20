function Header(props: { title: string }) {
    return (
        <h1>{props.title}</h1>
    );
}
 
export default function MoviesPage() {
  return (
    <div>
      <Header title="Movies" />
      <div>Aquí verás listado de películas.</div>
    </div>
  );
};