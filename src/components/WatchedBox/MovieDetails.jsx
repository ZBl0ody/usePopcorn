import Loader from "../Loader";
import StarRating from "../StarRating";
import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}${
  import.meta.env.VITE_API_KEY
}`;

const MovieDetails = ({
  rating,
  setRating,
  selectedID,
  handlecloseSelection,
  handleAddWatched,
  watched,
}) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const isWatched = watched.some((m) => m.imdbID === movie?.imdbID);
  const Rated = watched.find((m) => m.imdbID === movie?.imdbID)?.userRating;

  useEffect(() => {
    async function getMovieDetails() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}&i=${selectedID}`);
        if (!res.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedID]);

  useEffect(() => {
    document.title = `Movie | ${movie?.Title}`;

    return () => {
      if (!movie?.Title) return;
      document.title = "usePopcorn";
    };
  }, [movie?.Title]);

  useEffect(() => {
    const callBack = document.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        handlecloseSelection();
      }
    });
    return () => {
      document.removeEventListener("keydown", callBack);
    };
  }, [handlecloseSelection]);

  if (loading) return <Loader />;

  return (
    <div className="details">
      <button className="btn-back" onClick={handlecloseSelection}>
        &larr;
      </button>
      <header>
        <img src={movie?.Poster} alt={`Poster of ${movie?.Title} movie`} />
        <div className="details-overview">
          <h2>{movie?.Title}</h2>
          <p>
            {movie?.Released} &bull; {movie?.Runtime}
          </p>
          <p>{movie?.Genre}</p>
          <p>
            <span>⭐</span>
            {movie?.imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {isWatched ? (
            <p>You Rated This Movies ⭐{Rated}</p>
          ) : (
            <>
              <StarRating maxRating={10} onSetRating={setRating} />
              {rating > 0 && (
                <button
                  className="btn-add"
                  onClick={() => handleAddWatched(movie)}
                >
                  <span>+</span>
                  <span>Add to watched</span>
                </button>
              )}
            </>
          )}
        </div>

        <p>
          <em>{movie?.Plot}</em>
        </p>
        <p>{movie?.Actors}</p>
        <p>
          <em>Directed by {movie?.Director}</em>
        </p>
      </section>
    </div>
  );
};

export default MovieDetails;
