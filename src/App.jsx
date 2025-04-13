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
import MovieDetails from "./components/WatchedBox/MovieDetails";

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
    const controller = new AbortController();
    async function getMovies() {
      try {
        setLoading(true);
        setIsError("");
        const res = await fetch(`${API_URL}&s=${query}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        setMovies(data.Search);
        setIsError("");
      } catch (err) {
        if (err.name === "AbortError") return;
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
    return () => {
      controller.abort();
    };
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
            <MovieDetails
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
