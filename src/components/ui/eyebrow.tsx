import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Small uppercase label above a section heading ("BENEFITS" in the reference). */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-xs font-semibold uppercase tracking-[0.08em]", className)} {...props} />;
}
