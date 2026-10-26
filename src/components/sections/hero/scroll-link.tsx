"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useScrollTo } from "../header/use-scroll-to";

type ScrollLinkProps = Omit<ComponentProps<typeof Button>, "href"> & { to: string };

/** In-page anchor that glides through Lenis; still a plain `#id` link without JavaScript. */
export function ScrollLink({ to, onClick, ...props }: ScrollLinkProps) {
  const scrollTo = useScrollTo();
  return (
    <Button
      href={`#${to}`}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        if (!document.getElementById(to)) return;
        event.preventDefault();
        scrollTo(to);
      }}
      {...props}
    />
  );
}
