"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Like Motion's `useReducedMotion`, but hydration-safe: it reports `false`
 * while hydrating (matching the server HTML) and the real preference on the
 * very next render. Use it wherever reduced motion changes the rendered tree;
 * Motion's hook returns `null` on the server and `true` on the client's first
 * render, which makes React throw away the server HTML.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
