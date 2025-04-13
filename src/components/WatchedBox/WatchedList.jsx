export default function WatchedList({ watched, handleRemoveWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime} min</span>
            </p>
          </div>
          <button
            className="btn-delete"
            onClick={() => handleRemoveWatched(movie.imdbID)}
          >
            <span>&times;</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
