"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ViewToggle } from "./BriefViewer";

// The phone layout's sticky menu: the three parts of the brief, chips for the
// sections of the current part, a contents drawer, a reading-progress bar and
// a back-to-top button. Ported from the script in Alex's HTML (Nov 24, 2026).
// `id` is the id of each section anchor in a brief's MobileBrief.tsx (the
// same in every Cato brief).
const PARTS = ["Opportunity", "Why Cato", "The deal"];
const NAV = [
  { part: 0, label: "Market", id: "n0" },
  { part: 0, label: "Insider ally", id: "n1" },
  { part: 0, label: "Short term", id: "n2" },
  { part: 0, label: "Medium term", id: "n3" },
  { part: 0, label: "Long term", id: "n4" },
  { part: 0, label: "Political risk", id: "n5" },
  { part: 1, label: "Today", id: "n6" },
  { part: 1, label: "Tomorrow", id: "n7" },
  { part: 1, label: "Mid-term", id: "n8" },
  { part: 1, label: "Long term", id: "n9" },
  { part: 2, label: "Tranche 1", id: "n10" },
  { part: 2, label: "Supply", id: "n11" },
  { part: 2, label: "Revenue", id: "n12" },
  { part: 2, label: "Structure", id: "n13" },
  { part: 2, label: "Next four", id: "n14" },
];

export default function MobileNav() {
  const [current, setCurrent] = useState(-1); // index into NAV, -1 = cover
  // Chips stay hidden on first load until a section is reached (as in the
  // original); after that, the cover shows the first part's chips.
  const [reachedSection, setReachedSection] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const part = current < 0 ? -1 : NAV[current].part;

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    menuRef.current?.focus({ preventScroll: true });
  }, []);

  const go = useCallback(
    (id: string) => {
      closeDrawer();
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [closeDrawer],
  );

  // Track the section in view, the reading progress and the top button.
  useEffect(() => {
    let ticking = false;
    const mark = () => {
      ticking = false;
      const navH = (navRef.current?.offsetHeight ?? 0) + 90;
      let k = -1;
      for (let i = 0; i < NAV.length; i++) {
        const el = document.getElementById(NAV[i].id);
        if (el && el.getBoundingClientRect().top <= navH) k = i;
        else break;
      }
      const y = window.scrollY || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setCurrent(k);
      if (k >= 0) setReachedSection(true);
      setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0);
      setShowTop(y >= 600);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(mark);
      }
    };
    const first = requestAnimationFrame(mark);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", mark);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", mark);
    };
  }, []);

  // Keep the active chip in view.
  useEffect(() => {
    const chip = chipsRef.current?.querySelector<HTMLElement>(
      '[aria-current="true"]',
    );
    if (chip)
      chipsRef.current?.scrollTo({
        left: chip.offsetLeft - 12,
        behavior: "smooth",
      });
  }, [current]);

  // Drawer: lock page scroll, focus Close, Escape closes.
  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <>
      <header className="nav" id="nav" ref={navRef}>
        <div className="nrow">
          <button
            ref={menuRef}
            className="mbtn"
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="drawer"
            aria-label="Contents"
            onClick={() => setDrawerOpen(true)}
          >
            &#9776;
          </button>
          <nav className="parts" aria-label="Parts of the brief">
            {PARTS.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-current={part === i ? "true" : undefined}
                onClick={() => go(NAV.find((n) => n.part === i)!.id)}
              >
                {label}
              </button>
            ))}
          </nav>
          <ViewToggle className="mbtn alt">Desktop</ViewToggle>
        </div>
        <nav
          className="chips"
          aria-label="Sections in this part"
          ref={chipsRef}
        >
          {NAV.map((n, k) => (
            <button
              key={n.id}
              type="button"
              hidden={
                part < 0 ? !reachedSection || n.part !== 0 : n.part !== part
              }
              aria-current={k === current ? "true" : undefined}
              onClick={() => go(n.id)}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="prog">
          <i style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div
        className="drawer"
        id="drawer"
        hidden={!drawerOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Contents"
      >
        <div className="dwrap">
          <div className="dtop">
            <b>Contents</b>
            <button
              ref={closeRef}
              className="mbtn"
              type="button"
              onClick={closeDrawer}
            >
              Close
            </button>
          </div>
          <ul className="dlist">
            <li>
              <a
                href="#pg1"
                onClick={(e) => {
                  e.preventDefault();
                  closeDrawer();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Back to the cover
              </a>
            </li>
            {PARTS.map((label, i) => [
              <li key={`part-${label}`} className="gh">
                {`Page ${i + 1} · ${i === 0 ? "The opportunity" : label}`}
              </li>,
              ...NAV.filter((n) => n.part === i).map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(n.id);
                    }}
                  >
                    {n.label}
                  </a>
                </li>
              )),
            ])}
          </ul>
        </div>
      </div>

      <button
        className="totop"
        type="button"
        hidden={!showTop}
        onClick={() => {
          // Move focus to the menu button first: this button hides itself
          // near the top, and React re-focusing it then would cancel the
          // smooth scroll halfway.
          menuRef.current?.focus({ preventScroll: true });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        &#8593; Top
      </button>
    </>
  );
}
