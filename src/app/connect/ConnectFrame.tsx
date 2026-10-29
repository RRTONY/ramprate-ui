"use client";
import { useCallback, useEffect, useRef, useState } from "react";

function validHeight(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 100 &&
    value <= 20000
  );
}

export function getConnectFrameHeight(
  event: MessageEvent,
  frameWindow: Window | null,
  origin: string,
): number | null {
  if (
    !frameWindow ||
    event.origin !== origin ||
    event.source !== frameWindow ||
    event.data?.type !== "ramprate-connect-height" ||
    !validHeight(event.data.height)
  )
    return null;
  return Math.ceil(event.data.height) + 1;
}

export default function ConnectFrame({ src }: { src: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState<number>();

  const observeContent = useCallback(() => {
    observer.current?.disconnect();
    try {
      const document = frame.current?.contentDocument;
      if (!document || document.readyState === "loading") return;
      const root = document.querySelector("main.page");
      if (!root) return;
      const measure = () => {
        const nextHeight = root.getBoundingClientRect().height;
        if (validHeight(nextHeight)) setHeight(Math.ceil(nextHeight) + 1);
      };
      measure();
      observer.current = new ResizeObserver(measure);
      observer.current.observe(root);
    } catch {
      // Native iframe scrolling remains available if measurement is unavailable.
    }
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const nextHeight = getConnectFrameHeight(
        event,
        frame.current?.contentWindow ?? null,
        window.location.origin,
      );
      if (nextHeight !== null) setHeight(nextHeight);
    }
    window.addEventListener("message", onMessage);
    const initialMeasure = window.requestAnimationFrame(observeContent);
    return () => {
      window.cancelAnimationFrame(initialMeasure);
      window.removeEventListener("message", onMessage);
      observer.current?.disconnect();
    };
  }, [observeContent]);

  return (
    <iframe
      ref={frame}
      title="Connect with RampRate"
      src={src}
      onLoad={observeContent}
      className="block h-[994px] w-full border-0 bg-white max-[900px]:h-[855px] max-[520px]:h-[942px]"
      style={{ height }}
    />
  );
}
