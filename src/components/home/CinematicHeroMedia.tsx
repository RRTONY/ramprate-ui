"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const HERO_VIDEO = "/manus-storage/ramprate-cinematic-hero-loop_9982d784.mp4";
const HERO_IMAGE =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663947056547/VFawfsbNshYpRmcd.png";

export default function CinematicHeroMedia() {
  const [canAnimate, setCanAnimate] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setCanAnimate(!reducedMotion.matches);

    updateMotionPreference();
    reducedMotion.addEventListener("change", updateMotionPreference);
    return () =>
      reducedMotion.removeEventListener("change", updateMotionPreference);
  }, []);

  return (
    <>
      <Image
        src={HERO_IMAGE}
        alt="Professionals walking toward an illuminated modern office at sunset"
        fill
        priority
        sizes="100vw"
        className="rr-cinematic-hero-fallback object-cover object-right"
      />
      {canAnimate ? (
        <video
          className={`rr-cinematic-hero-video ${videoReady ? "is-ready" : ""}`}
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_IMAGE}
          preload="metadata"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
