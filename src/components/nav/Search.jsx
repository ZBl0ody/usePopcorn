import { useEffect, useRef } from "react";
import { useKey } from "../WatchedBox/hook/useKey";

export default function Search({ setQuery, query }) {
  const el = useRef(null);

  useEffect(() => {
    el.current.focus();
  }, []);

  useKey(function handleFocus() {
    if (document.activeElement === el.current) return;
    el.current.focus();
    setQuery("");
  }, "Enter");
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
