import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ComponentProps<"a"> & {
  variant?: "primary" | "outline" | "link";
};

// WebIndia blue CTA: white text on #0048A9 is ≈8.4:1; hover deepens to navy (≈18:1).
const variants = {
  primary:
    "rounded-card border border-ink bg-cta px-4 pb-2 pt-2.5 text-white shadow-btn transition-colors duration-200 hover:bg-ink",
  outline: "rounded-card border border-ink px-4 pb-2 pt-2.5 transition-colors duration-200 hover:bg-tint",
  link: "underline decoration-1 underline-offset-4 transition-colors hover:text-accent",
};

/** Link styled as a button. Every CTA on this page navigates, so it is always an <a>. */
export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <a
      className={cn("inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium", variants[variant], className)}
      {...props}
    />
  );
}
