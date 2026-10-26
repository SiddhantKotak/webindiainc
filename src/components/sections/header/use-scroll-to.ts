"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";

/**
 * Smooth-scrolls to an in-page id through the single Lenis instance (a native jump under
 * reduced motion, where Lenis isn't mounted), then does what a native `#id` link would:
 * records the hash and moves focus to the target, so the next Tab continues from that
 * section instead of jumping back to the link.
 */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      if (lenis) {
        lenis.start();
        lenis.scrollTo(id === "top" ? 0 : target, { duration: 1.2 });
      } else {
        target.scrollIntoView({ block: "start" });
      }
      if (window.location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);

      // Two frames: when called from the drawer, the page is still `inert` until the drawer's
      // close commits and its effect cleanup runs; focusing before that would silently fail.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }),
      );
    },
    [lenis],
  );
}
