import { useEffect } from "react";

export const useKey = (fn, key) => {
  useEffect(() => {
    const callBack = (e) => {
      if (e.code === key) {
        fn();
      }
    };
    document.addEventListener("keydown", callBack);
    return () => {
      document.removeEventListener("keydown", callBack);
    };
  }, [fn]);

  return;
};
