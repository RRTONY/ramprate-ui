"use client";

import { useEffect, useState } from "react";

/**
 * Radix portal-based primitives (Dialog, Select, Tooltip, ...) render into
 * document.body by default, which sits outside the `.flow-scope` wrapper
 * that carries all of this section's theme CSS variables (--primary,
 * --background, etc). Without a container override, portaled content loses
 * every one of those variables and renders unstyled. This returns the
 * nearest `.flow-scope` element so callers can pass it as the portal's
 * `container` prop instead.
 */
export function useFlowScopeContainer() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.querySelector<HTMLElement>(".flow-scope"));
  }, []);

  return container;
}
