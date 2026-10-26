"use client";

import { useCallback, useSyncExternalStore } from "react";

// One MediaQueryList per query string, shared by every subscriber.
const lists = new Map<string, MediaQueryList>();
const listFor = (query: string) => {
  let list = lists.get(query);
  if (!list) {
    list = window.matchMedia(query);
    lists.set(query, list);
  }
  return list;
};

/**
 * Whether a media query matches. Hydration-safe: it reports `false` on the server and during
 * hydration (so the first client render matches the server HTML), then the real value on the
 * next render, and it updates when the query's result changes.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = listFor(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => listFor(query).matches,
    () => false,
  );
}
