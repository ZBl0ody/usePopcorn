import { useEffect, useState } from "react";
import { tempMovieData, tempWatchedData } from "../public/tempMovieData";
import NavBar from "./components/nav/NavBar";
import Layout from "./components/Layout";
import Box from "./components/Box";
import MovieList from "./components/moiveBox/MovieList";
import NumResult from "./components/nav/NumResult";
import Search from "./components/nav/Search";
import Summary from "./components/WatchedBox/Summary";
import WatchedList from "./components/WatchedBox/WatchedList";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import StarRating from "./components/StarRating";

const API_URL = `${import.meta.env.VITE_API_URL}${
  import.meta.env.VITE_API_KEY
}`;
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("avatar");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const [rating, setRating] = useState(0);

  function handleSelection(id) {
    if (id === selectedID) {
      setSelectedID(null);
      return;
    }
    setSelectedID(id);
  }

  function handlecloseSelection() {
    setSelectedID(null);
  }

  function handleAddWatched(movie) {
    if (watched.some((m) => m.imdbID === movie.imdbID)) {
      handlecloseSelection();
      return;
    }
    const newWatchdMovie = {
      Title: movie.Title,
      Poster: movie.Poster,
      Runtime: +movie.Runtime.split(" ")[0],
      imdbRating: +movie.imdbRating,
      Released: +movie.Released.split(" ")[2],
      imdbID: movie.imdbID,
      userRating: rating,
    };
    setWatched((watched) => [...watched, newWatchdMovie]);
    handlecloseSelection();
  }
  function handleRemoveWatched(id) {
    setWatched((watched) => watched.filter((m) => m.imdbID !== id));
  }

  useEffect(() => {
    async function getMovies() {
      try {
        setLoading(true);
        setIsError(null);
        const res = await fetch(`${API_URL}&s=${query}`);
        if (!res.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        setMovies(data.Search);
      } catch (err) {
        setIsError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (query.length < 3) {
      setIsError("");
      setMovies([]);
      return;
    }
    getMovies();
  }, [query]);

  return (
    <>
      <NavBar>
        <Search setQuery={setQuery} query={query} />
        <NumResult movies={movies} />
      </NavBar>

      <Layout>
        <Box>
          {loading && <Loader />}
          {isError && <ErrorMessage err={isError} />}
          {!loading && !isError && (
            <MovieList
              movies={movies}
              watched={watched}
              setWatched={setWatched}
              handleSelection={handleSelection}
            />
          )}
        </Box>
        <Box>
          {selectedID ? (
            <SelectedMovie
              watched={watched}
              rating={rating}
              setRating={setRating}
              selectedID={selectedID}
              handleAddWatched={handleAddWatched}
              handlecloseSelection={handlecloseSelection}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList
                handleRemoveWatched={handleRemoveWatched}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Layout>
    </>
  );
}

const SelectedMovie = ({
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
