import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}${
  import.meta.env.VITE_API_KEY
}`;
export const useMovies = (query) => {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [movies, setMovies] = useState([]);

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

  return [loading, isError, movies];
};
