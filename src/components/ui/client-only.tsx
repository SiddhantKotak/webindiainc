"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};

/**
 * Renders `fallback` on the server and during hydration, then `children` on the client.
 * Use for browser-only leaves (WebGL, canvas); Next 16 forbids `dynamic({ ssr: false })`
 * in Server Components, so wrap the dynamic import's component in this inside a client file.
 */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return mounted ? children : fallback;
}
