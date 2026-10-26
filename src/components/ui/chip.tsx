import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Small outlined label: platform pills, industry tags, numbered step chips. */
export function Chip({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-flex items-center rounded-card border border-ink px-2.5 pb-1 pt-1.5 text-sm leading-none", className)}
      {...props}
    />
  );
}
