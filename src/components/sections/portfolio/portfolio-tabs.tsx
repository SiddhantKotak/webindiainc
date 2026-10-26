"use client";

import { motion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import type { PortfolioCategory, PortfolioItem } from "@/content/portfolio";
import { cn } from "@/lib/cn";
import { underlinePath } from "@/lib/scribble";
import { CompareStage } from "./compare-stage";
import { SitePreview } from "./site-preview";

type Tab = { key: PortfolioCategory; label: string; href: string };

const TAB_SCRIBBLE = underlinePath(12, 44, 10);

/**
 * Pattern C: four outlined tabs over one framed panel. Each tab holds three real cases with a
 * numbered switcher; the stage below is the evidence (before → after screenshots, or a live
 * WordPress build scrolling in a browser window).
 */
export function PortfolioTabs({ tabs, items }: { tabs: Tab[]; items: PortfolioItem[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const select = (index: number, focus: boolean) => {
    setActive(index);
    const tab = tabRefs.current[index];
    if (!tab) return;
    if (focus) tab.focus({ preventScroll: true });
    // Phones: keep the chosen tab visible in the scrolling strip without moving the page.
    const list = listRef.current;
    if (list && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = tabs.length - 1;
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select((next + tabs.length) % tabs.length, true);
  };

  return (
    <div className="overflow-hidden rounded-card border border-ink bg-paper">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Portfolio"
        className="flex snap-x overflow-x-auto border-b border-ink [scrollbar-width:none] sm:grid sm:grid-cols-4 sm:overflow-visible"
      >
        {tabs.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.key}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i, false)}
              onKeyDown={onKeyDown}
              className={cn(
                "relative min-w-[9.5rem] shrink-0 cursor-pointer snap-start border-ink px-5 pb-6 pt-5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:-outline-offset-4! sm:min-w-0 sm:px-3",
                i > 0 && "border-l",
                selected ? "bg-paper" : "bg-paper hover:bg-tint",
              )}
            >
              {tab.label}
              {selected && (
                <motion.svg
                  layoutId={`${baseId}-scribble`}
                  aria-hidden
                  viewBox="0 0 44 10"
                  fill="none"
                  className="absolute bottom-2 left-1/2 h-2.5 w-11 -translate-x-1/2 overflow-visible"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                >
                  <path d={TAB_SCRIBBLE} stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" />
                </motion.svg>
              )}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${baseId}-panel-${tab.key}`}
          aria-labelledby={`${baseId}-tab-${tab.key}`}
          hidden={i !== active}
          // The browser frame bleeds through the 16px phone padding (browser-frame.tsx).
          className="px-4 py-6 sm:p-6 lg:p-8 xl:p-10"
        >
          {/* Mounted only while selected, so hidden tabs never fetch their screenshots. */}
          {i === active && <CategoryPanel tab={tab} items={items.filter((item) => item.category === tab.key)} />}
        </div>
      ))}
    </div>
  );
}

const FIELD_LABELS: Record<PortfolioCategory, FieldLabels> = {
  googleAds: { objective: "Objective", results: "Results" },
  facebookAds: { objective: "Objective", results: "Results" },
  seo: { objective: "Goals", results: "Results" },
  wordpress: { objective: "Objective", results: "Results" },
};

function CategoryPanel({ tab, items }: { tab: Tab; items: PortfolioItem[] }) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  if (!item) return null;
  const labels = FIELD_LABELS[tab.key];
  const hasFields = items.some((it) => it.objective || it.results);

  return (
    // Below 1280px: switcher, title, stage, fields. From 1280px the case reads as a sheet: the
    // text in a column on the left, the evidence filling the rest of the width.
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 sm:gap-8 xl:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] xl:grid-rows-[auto_auto_1fr] xl:gap-x-12">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 xl:col-start-1 xl:row-start-1">
        <div role="group" aria-label={tab.label} className="flex gap-2">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              aria-pressed={i === index}
              aria-label={`${String(i + 1).padStart(2, "0")}. ${it.title}`}
              onClick={() => setIndex(i)}
              className={cn(
                "numeral grid h-11 w-12 cursor-pointer place-items-center rounded-card border border-ink text-sm transition-colors duration-300",
                i === index ? "bg-sky" : "bg-paper hover:bg-tint",
              )}
            >
              {`${String(i + 1).padStart(2, "0")}.`}
            </button>
          ))}
        </div>
        <Button variant="link" href={tab.href} className="text-sm">
          {tab.label} portfolio
          <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
            <path d="M1.5 6h9M7 2.5 10.5 6 7 9.5" />
          </svg>
        </Button>
      </div>

      {/* Each item's title and fields share one grid cell with the others', so the cell is as
          tall as the longest and switching items never moves the stage or the page below. */}
      <div className="grid xl:col-start-1 xl:row-start-2">
        {items.map((it, i) => (
          <ItemTitle key={it.id} item={it} active={i === index} />
        ))}
      </div>

      <div data-stage className="xl:col-start-2 xl:row-span-3 xl:row-start-1">
        {tab.key === "wordpress" ? <SitePreview key={item.id} item={item} /> : <CompareStage key={item.id} item={item} siblings={items} />}
      </div>

      {hasFields && (
        <div className="grid border-t border-ink pt-6 xl:col-start-1 xl:row-start-3 xl:self-start">
          {items.map((it, i) => (
            <ItemFields key={it.id} item={it} labels={labels} active={i === index} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Inactive items stay laid out (to hold the cell's height) but are hidden from everyone. */
const stacked = (active: boolean) =>
  cn("col-start-1 row-start-1 transition-opacity duration-300", active ? "opacity-100" : "invisible opacity-0");

function ItemTitle({ item, active }: { item: PortfolioItem; active: boolean }) {
  return (
    <div
      aria-hidden={!active || undefined}
      inert={!active}
      className={cn(
        stacked(active),
        "flex flex-col items-start gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 xl:flex-col xl:items-start xl:gap-4",
      )}
    >
      <h3 title={item.title} className="line-clamp-3 max-w-[38ch] font-display text-xl leading-[1.15] tracking-tight sm:order-first sm:text-2xl">
        {item.title}
      </h3>
      {item.industry && <Chip className="order-first shrink-0 bg-white sm:order-none xl:order-first">{item.industry}</Chip>}
    </div>
  );
}

type FieldLabels = { objective: string; results: string };

function ItemFields({ item, labels, active }: { item: PortfolioItem; labels: FieldLabels; active: boolean }) {
  if (!item.objective && !item.results) return <div aria-hidden className={stacked(active)} />;
  return (
    <dl
      aria-hidden={!active || undefined}
      inert={!active}
      className={cn(stacked(active), "grid content-start gap-4 text-sm leading-relaxed sm:grid-cols-2 sm:gap-10 lg:text-[0.9375rem] xl:grid-cols-1 xl:gap-5")}
    >
      {item.objective && (
        <div className={cn(!item.results && "sm:col-span-2 sm:max-w-[62ch] xl:col-span-1")}>
          <dt className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em]">{labels.objective}</dt>
          <dd className="text-ink/80">{item.objective}</dd>
        </div>
      )}
      {item.results && (
        <div>
          <dt className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em]">{labels.results}</dt>
          <dd className="text-ink/80">{item.results}</dd>
        </div>
      )}
    </dl>
  );
}
