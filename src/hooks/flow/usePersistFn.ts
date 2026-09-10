import { useCallback, useEffect, useRef } from "react";

/**
 * usePersistFn instead of useCallback to reduce cognitive load
 */
export function usePersistFn<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return useCallback((...args: Args) => fnRef.current(...args), []);
}
