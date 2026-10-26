"use client";

import { useLenis } from "lenis/react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/content/assets";
import { cn } from "@/lib/cn";
import { useActiveSection } from "./use-active-section";
import { useScrollTo } from "./use-scroll-to";

type NavLink = { label: string; href: string };

type HeaderClientProps = {
  /** Accessible name of the wordmark link. */
  name: string;
  /** The full logo for the light header, and the "W" mark shown once collapsed. */
  logo: Asset;
  mark: Asset;
  cta: NavLink;
  sections: readonly { id: string; label: string }[];
  links: readonly NavLink[];
  illustration: Asset | null;
};

const COLLAPSE_AT = 80;
const MENU_ID = "site-menu";

export function HeaderClient({ name, logo, mark, cta, sections, links, illustration }: HeaderClientProps) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const lenis = useLenis();
  const scrollTo = useScrollTo();
  const active = useActiveSection(sections.map((s) => s.id));

  const rootRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setCollapsed(y > COLLAPSE_AT));
  // A reload or deep link can restore a mid-page scroll position without any scroll event, so
  // read the position once after mount (in a frame, never during the hydration render).
  useEffect(() => {
    const frame = requestAnimationFrame(() => setCollapsed(scrollY.get() > COLLAPSE_AT));
    return () => cancelAnimationFrame(frame);
  }, [scrollY]);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  // Hold the page still while the drawer is open. Lenis is absent under reduced motion.
  useEffect(() => {
    if (!open) return;
    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    }
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [open, lenis]);

  // Modal behaviour: everything outside the header is inert, focus starts in the drawer,
  // Tab wraps within the header, Escape closes.
  useEffect(() => {
    const root = rootRef.current;
    if (!open || !root) return;

    const inerted: HTMLElement[] = [];
    let node: HTMLElement = root;
    while (node.parentElement && node !== document.body) {
      for (const sibling of Array.from(node.parentElement.children)) {
        if (sibling === node || !(sibling instanceof HTMLElement) || sibling.inert) continue;
        if (["SCRIPT", "STYLE", "LINK", "TEMPLATE"].includes(sibling.tagName)) continue;
        sibling.inert = true;
        inerted.push(sibling);
      }
      node = node.parentElement;
    }

    drawerRef.current?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter(
        (el) => el.getClientRects().length > 0,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !root.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !root.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      inerted.forEach((el) => (el.inert = false));
    };
  }, [open, close]);

  const go = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    if (open) close();
    scrollTo(id);
  };

  return (
    // Full-width and transparent, so the header itself ignores the pointer; only the bar clusters,
    // the dim layer and the drawer take clicks.
    <header ref={rootRef} className="pointer-events-none fixed inset-x-0 top-0 z-50 text-ink">
      {/* Page dim: click to close. */}
      <div
        aria-hidden
        onClick={close}
        className={cn(
          "fixed inset-0 bg-ink/40 transition-opacity duration-500 motion-reduce:transition-none",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        id={MENU_ID}
        ref={drawerRef}
        className={cn(
          "pointer-events-auto fixed inset-y-0 right-0 flex w-[85vw] max-w-[370px] flex-col overflow-hidden bg-ink text-white",
          "duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none",
          // Visibility flips at once on open (so focus can move in) and only after the slide on close.
          open ? "visible translate-x-0 transition-[translate]" : "invisible translate-x-full transition-[translate,visibility]",
        )}
      >
        {/* data-lenis-prevent: Lenis is stopped while the drawer is open, and would otherwise swallow
            wheel/touch scrolling inside it on short screens. */}
        <div data-lenis-prevent className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6 pb-8 pt-24 sm:px-8 sm:pt-28">
          <nav aria-label="Sections" className="ml-auto w-full max-w-[250px]">
            <ul>
              {sections.map(({ id, label }, i) => (
                <li key={id} className="border-t border-white/25 last:border-b">
                  <a
                    href={`#${id}`}
                    onClick={go(id)}
                    aria-current={active === id ? "location" : undefined}
                    className={cn(
                      "block py-3 text-right text-lg leading-tight transition-[color,translate,opacity] duration-500 hover:text-sky motion-reduce:transition-none",
                      active === id ? "text-sky" : "text-white",
                      open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
                    )}
                    style={{ transitionDelay: open ? `${150 + i * 45}ms` : "0ms" }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Button href={cta.href} className="ml-auto mt-8 sm:hidden">
            {cta.label}
          </Button>

          <nav aria-label="Company" className="ml-auto mt-auto w-full max-w-[250px] pt-12">
            <ul className="flex flex-col items-end">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="inline-block py-2 text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {illustration && (
          <div className="relative h-[32vh] shrink-0">
            <Image src={illustration.src} alt={illustration.alt} fill sizes="370px" className="object-cover" />
          </div>
        )}
      </div>

      {/* The bar sits above the drawer, so the menu button doubles as its close control. */}
      <div
        className={cn(
          // The bar is transparent and full width: let clicks through its empty middle to the page.
          "pointer-events-none relative flex items-center justify-between gap-4 px-(--page-margin) transition-[height] duration-300",
          collapsed ? "h-16" : "h-[72px] sm:h-[88px]",
        )}
      >
        <div
          // On phones the open drawer slides under the logo (navy on navy); step it aside.
          className={cn(
            "wi-intro pointer-events-auto flex items-center gap-3 transition-opacity duration-300",
            open && "max-sm:pointer-events-none max-sm:opacity-0",
          )}
          style={{ "--intro-x": "50px", "--intro-y": "50px" } as CSSProperties}
        >
          <a
            href="#top"
            aria-label={name}
            onClick={go("top")}
            className="relative flex h-10 items-center sm:h-12 lg:h-14"
          >
            {/* The original WebIndia logo (navy-lettering version for the light header); on scroll it
                hands over to the coloured "W" mark alone. Both stay mounted and crossfade. */}
            <Image
              src={logo.src}
              alt=""
              width={logo.width}
              height={logo.height}
              loading="eager"
              quality={90}
              sizes="(min-width: 1024px) 250px, 200px"
              className={cn(
                "h-9 w-auto origin-left transition-[opacity,scale] duration-300 sm:h-11 lg:h-[52px] motion-reduce:transition-none",
                collapsed ? "scale-90 opacity-0" : "opacity-100",
              )}
            />
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-[10px] border border-ink bg-paper transition-[opacity,scale] duration-300 sm:size-11 motion-reduce:transition-none",
                collapsed ? "opacity-100" : "pointer-events-none scale-75 opacity-0",
              )}
            >
              <Image src={mark.src} alt="" width={mark.width} height={mark.height} loading="eager" sizes="44px" className="h-6 w-auto sm:h-7" />
            </span>
          </a>
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          <Button href={cta.href} className="max-sm:hidden">
            {cta.label}
          </Button>
          <button
            ref={buttonRef}
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={() => (open ? close() : setOpen(true))}
            className={cn(
              "relative grid size-11 place-items-center rounded-card border border-ink transition-colors duration-200",
              open ? "bg-sky" : "bg-cta hover:bg-ink",
            )}
          >
            <span aria-hidden className="relative block h-3 w-[18px]">
              {[
                open ? "top-[5px] rotate-45" : "top-0",
                open ? "top-[5px] opacity-0" : "top-[5px]",
                open ? "top-[5px] -rotate-45" : "top-[10px]",
              ].map((state, i) => (
                <span
                  key={i}
                  className={cn(
                    "absolute left-0 h-[1.5px] w-full rounded-full transition-[top,rotate,opacity] duration-300 motion-reduce:transition-none",
                    // White on the blue button, ink on the open (sky) state.
                    open ? "bg-ink" : "bg-white",
                    state,
                  )}
                />
              ))}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
