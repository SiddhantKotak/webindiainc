import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Page-width wrapper on the shared layout tokens (`--content`, `--gutter` in globals.css). */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-(--content) px-(--gutter)", className)} {...props} />;
}
