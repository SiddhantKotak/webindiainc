import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** The reference's flat card: 1px ink border, 8px radius, no shadow. */
export function OutlineCard({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-card border border-ink", className)} {...props} />;
}
