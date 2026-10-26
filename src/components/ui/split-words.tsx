"use client";

import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type SplitWordsProps = {
  text: string;
  as?: "p" | "h1" | "h2" | "h3" | "span";
  /**
   * "stagger": words rise in one after another when the block enters view.
   * "scroll": words darken in reading order as the block scrolls up (the reference's intro).
   */
  mode?: "stagger" | "scroll";
  /** Seconds before the stagger starts. */
  delay?: number;
  className?: string;
};

/**
 * Splits a string into word spans for reveal animations. The words stay real text
 * separated by real spaces, so selection, search and screen readers read the sentence.
 */
export function SplitWords({ text, as: Tag = "p", mode = "stagger", delay = 0, className }: SplitWordsProps) {
  const reduceMotion = usePrefersReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  if (reduceMotion) return <Tag className={className}>{text}</Tag>;

  return mode === "scroll" ? (
    <ScrollWords words={words} Tag={Tag} className={className} />
  ) : (
    <StaggerWords words={words} Tag={Tag} delay={delay} className={className} />
  );
}

type InnerProps = { words: string[]; Tag: NonNullable<SplitWordsProps["as"]>; className?: string };

function StaggerWords({ words, Tag, delay, className }: InnerProps & { delay: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <Tag ref={ref as never} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          {i > 0 && " "}
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: "0.35em" }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: delay + i * 0.035, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

function ScrollWords({ words, Tag, className }: InnerProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  return (
    <Tag ref={ref as never} className={cn(className)}>
      {words.map((word, i) => (
        <span key={i}>
          {i > 0 && " "}
          <ScrollWord progress={scrollYProgress} start={i / words.length} end={(i + 1) / words.length}>
            {word}
          </ScrollWord>
        </span>
      ))}
    </Tag>
  );
}

function ScrollWord({
  progress,
  start,
  end,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: string;
}) {
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
