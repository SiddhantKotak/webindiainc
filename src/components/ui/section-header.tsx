import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./eyebrow";

type SectionHeaderProps = {
  eyebrow?: string;
  /** The h2. Pass a node to mix in underlines or circles. */
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
  /** Use "h1" only for the hero. */
  as?: "h1" | "h2";
  className?: string;
};

/** Eyebrow, regular-weight display heading and optional intro, in the reference's rhythm. */
export function SectionHeader({ eyebrow, title, intro, align = "center", as: Heading = "h2", className }: SectionHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-5", align === "center" ? "mx-auto items-center text-center" : "items-start", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading className="max-w-[22ch] font-display text-[2rem] leading-[1.08] tracking-tight text-balance sm:text-[2.5rem]">
        {title}
      </Heading>
      {intro && <div className="max-w-[46ch] text-lg leading-snug">{intro}</div>}
    </header>
  );
}
