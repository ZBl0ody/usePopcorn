import { useEffect, useRef } from "react";

export default function Search({ setQuery, query }) {
  const el = useRef(null);
  useEffect(() => {
    el.current.focus();
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === el.current) return;

      if (e.code === "Enter") {
        el.current.focus();
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setQuery]);

  return (
    <input
      ref={el}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
