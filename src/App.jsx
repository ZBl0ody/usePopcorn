import { useEffect, useState } from "react";
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
import { useMovies } from "./components/WatchedBox/hook/useMovies";
import { useLocalStorage } from "./components/WatchedBox/hook/useLocalStorage";

export default function App() {
  const [query, setQuery] = useState("avatar");
  const [selectedID, setSelectedID] = useState(null);
  const [rating, setRating] = useState(0);

  const [loading, isError, movies] = useMovies(query);
  const [watched, setWatched] = useLocalStorage([], "watched");

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
