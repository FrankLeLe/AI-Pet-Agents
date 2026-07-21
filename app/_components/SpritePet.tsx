"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { ANIMATIONS } from "@/lib/pet-animation";
import type { AnimationKey } from "@/lib/pet-animation";

import styles from "./sprite-pet.module.css";

type SpritePetProps = {
  petId: string;
  animation?: AnimationKey;
  eager?: boolean;
  label?: string;
  className?: string;
};

type SpriteStyle = CSSProperties & {
  "--sprite-columns": number;
  "--sprite-x": string;
};

export function SpritePet({
  petId,
  animation = "idle",
  eager = false,
  label,
  className,
}: SpritePetProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const config = useMemo(
    () => ANIMATIONS.find((item) => item.key === animation) ?? ANIMATIONS[0],
    [animation],
  );

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
    const image = imageRef.current;
    if (!image) return;

    const showFrame = (frame: number) => {
      image.style.setProperty(
        "--sprite-x",
        `-${frame * (100 / config.frames)}%`,
      );
    };

    showFrame(0);
    if (!canAnimate || !isVisible) return;

    let current = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const delay = config.durations[current] ?? 170;
      timer = setTimeout(() => {
        current = (current + 1) % config.frames;
        showFrame(current);
        tick();
      }, delay);
    };

    tick();
    return () => clearTimeout(timer);
  }, [animation, canAnimate, config, isVisible]);

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
        ref={imageRef}
        src={`/pets/${petId}/web/animations/${animation}.webp`}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "low"}
        decoding="async"
        style={
          {
            "--sprite-columns": config.frames,
            "--sprite-x": "0%",
          } as SpriteStyle
        }
      />
    </div>
  );
}
