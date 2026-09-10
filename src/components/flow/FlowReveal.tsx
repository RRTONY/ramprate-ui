"use client";

import type { CSSProperties, HTMLAttributes } from "react";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  initial?: unknown;
  animate?: unknown;
  transition?: unknown;
  whileHover?: unknown;
};

function getComputedStyle(
  animate: unknown,
  style: CSSProperties | undefined,
): CSSProperties | undefined {
  if (!animate || typeof animate !== "object" || !("width" in animate)) {
    return style;
  }

  const width = (animate as { width?: unknown }).width;
  if (typeof width !== "string" && typeof width !== "number") return style;
  return { ...style, width };
}

function revealClassName(className?: string) {
  return ["flow-reveal", className].filter(Boolean).join(" ");
}

function getDomProps(props: RevealProps) {
  const domProps = { ...props };
  delete domProps.initial;
  delete domProps.animate;
  delete domProps.transition;
  delete domProps.whileHover;
  return domProps;
}

export function FlowMotionDiv(props: RevealProps) {
  const domProps = getDomProps(props);
  return (
    <div
      {...domProps}
      className={revealClassName(props.className)}
      style={getComputedStyle(props.animate, props.style)}
    />
  );
}

export function FlowMotionSection(props: RevealProps) {
  const domProps = getDomProps(props);
  return (
    <section
      {...domProps}
      className={revealClassName(props.className)}
      style={getComputedStyle(props.animate, props.style)}
    />
  );
}
