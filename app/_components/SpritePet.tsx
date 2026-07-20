"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { ANIMATIONS } from "@/lib/pets";
import type { AnimationKey } from "@/lib/pets";

import styles from "./site-chrome.module.css";

type SpritePetProps = {
  petId: string;
  animation?: AnimationKey;
  eager?: boolean;
  label?: string;
  className?: string;
};

type SpriteStyle = CSSProperties & {
  "--sprite-x": string;
  "--sprite-y": string;
};

export function SpritePet({
  petId,
  animation = "idle",
  eager = false,
  label,
  className,
}: SpritePetProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [playback, setPlayback] = useState<{ animation: AnimationKey; frame: number }>({
    animation,
    frame: 0,
  });
  const [canAnimate, setCanAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const config = useMemo(
    () => ANIMATIONS.find((item) => item.key === animation) ?? ANIMATIONS[0],
    [animation],
  );
  const frame = playback.animation === animation ? playback.frame : 0;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanAnimate(!motion.matches && !document.hidden);
    const onVisibilityChange = () => update();

    update();
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canAnimate || !isVisible) return;

    let current = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const delay = config.durations[current] ?? 170;
      timer = setTimeout(() => {
        current = (current + 1) % config.frames;
        setPlayback({ animation, frame: current });
        tick();
      }, delay);
    };

    tick();
    return () => clearTimeout(timer);
  }, [animation, canAnimate, config, isVisible]);

  const row = animation === "look" && frame >= 8 ? 10 : config.row;
  const column = animation === "look" ? frame % 8 : frame;
  const spriteStyle: SpriteStyle = {
    "--sprite-x": `-${column * 12.5}%`,
    "--sprite-y": `-${row * (100 / 11)}%`,
  };

  return (
    <div
      className={[styles.spriteWindow, className].filter(Boolean).join(" ")}
      role="img"
      aria-label={label ?? `${petId} Codex pet`}
      ref={rootRef}
    >
      {/* A raw img is required because the renderer crops one moving cell from the full atlas. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/pets/${petId}/spritesheet.webp`}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        style={spriteStyle}
      />
    </div>
  );
}
