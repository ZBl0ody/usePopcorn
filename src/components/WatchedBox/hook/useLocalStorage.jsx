import { useEffect, useState } from "react";

export const useLocalStorage = (inistialState, key) => {
  const [value, setValue] = useState(() => {
    const storageValues = localStorage.getItem(key);
    return storageValues === null ? inistialState : JSON.parse(storageValues);
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
};
