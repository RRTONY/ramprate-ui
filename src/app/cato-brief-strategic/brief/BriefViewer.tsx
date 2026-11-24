"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type View = "desktop" | "mobile";
const STORAGE_KEY = "cato-strategic-view";
const listeners = new Set<() => void>();

// Same rule as the original brief: phones and narrow windows get the phone
// layout, everything else the desktop one.
function autoView(): View {
  const w = Math.min(window.innerWidth, window.screen.width || 9999);
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  return window.innerWidth <= 760 || (coarse && w <= 900)
    ? "mobile"
    : "desktop";
}

// A layout the reader picked with the brief's own button wins over the
// automatic choice for the rest of the visit.
function chosenView(): View | null {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    return v === "desktop" || v === "mobile" ? v : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("resize", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("resize", onChange);
  };
}

const ToggleContext = createContext<() => void>(() => {});

/** The brief's "Mobile view" / "Desktop" button. */
export function ViewToggle({
  className,
  id,
  children,
}: {
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  const toggle = useContext(ToggleContext);
  return (
    <button type="button" className={className} id={id} onClick={toggle}>
      {children}
    </button>
  );
}

/**
 * Shows one of the brief's two layouts. Before the page is interactive, CSS
 * picks by screen width (see .cato-viewer in brief.css), so there is no flash.
 */
export default function BriefViewer({
  desktop,
  mobile,
}: {
  desktop: ReactNode;
  mobile: ReactNode;
}) {
  const view = useSyncExternalStore(
    subscribe,
    () => chosenView() ?? autoView(),
    () => null,
  );

  const toggle = useCallback(() => {
    const current = chosenView() ?? autoView();
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        current === "mobile" ? "desktop" : "mobile",
      );
    } catch {
      /* storage blocked: the choice just won't be remembered */
    }
    listeners.forEach((notify) => notify());
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <ToggleContext.Provider value={toggle}>
      <div className="cato-viewer" data-view={view ?? undefined}>
        {desktop}
        {mobile}
      </div>
    </ToggleContext.Provider>
  );
}
