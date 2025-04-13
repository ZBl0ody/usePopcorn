import Movie from "./Movie";

export default function MovieList({ movies, handleSelection }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelection={handleSelection}
        />
      ))}
    </ul>
  );
}
