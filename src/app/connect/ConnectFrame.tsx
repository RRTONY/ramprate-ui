"use client";
import { useEffect, useState } from "react";

export default function ConnectFrame({ src }: { src: string }) {
  const [height, setHeight] = useState(1500);
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== "ramprate-connect-height"
      )
        return;
      const nextHeight = Number(event.data.height);
      if (Number.isFinite(nextHeight) && nextHeight > 300 && nextHeight < 10000)
        setHeight(nextHeight + 12);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return (
    <iframe
      title="Connect with RampRate"
      src={src}
      className="block w-full border-0 bg-white"
      style={{ height }}
    />
  );
}
