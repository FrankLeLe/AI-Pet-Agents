"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";

import { ANIMATIONS } from "@/lib/pet-animation";
import type { AnimationKey } from "@/lib/pet-animation";

import styles from "./sprite-pet.module.css";

type SpritePetProps = {
  petId: string;
  animation?: AnimationKey;
  preloadAnimations?: readonly AnimationKey[];
  paused?: boolean;
  eager?: boolean;
  label?: string;
  getAnimationLabel?: (animation: AnimationKey) => string;
  onDisplayedAnimationChange?: (animation: AnimationKey) => void;
  onAnimationError?: (animation: AnimationKey) => void;
  className?: string;
};

type SpriteStyle = CSSProperties & {
  "--sprite-columns": number;
  "--sprite-x": string;
};

type LayerDecodeRecord = {
  image: HTMLImageElement;
  promise: Promise<void>;
};

type FrameState = {
  animation: AnimationKey;
  frame: number;
};

function petAnimationUrl(petId: string, animation: AnimationKey) {
  return `/pets/${petId}/web/animations/${animation}.webp`;
}

type SpriteLayerImageProps = {
  petId: string;
  animation: AnimationKey;
  active: boolean;
  ready: boolean;
  eager: boolean;
  onImageRef: (
    animation: AnimationKey,
    node: HTMLImageElement | null,
  ) => void;
  onReady: (animation: AnimationKey, image: HTMLImageElement) => void;
  onFailed: (animation: AnimationKey, image: HTMLImageElement) => void;
};

function SpriteLayerImage({
  petId,
  animation,
  active,
  ready,
  eager,
  onImageRef,
  onReady,
  onFailed,
}: SpriteLayerImageProps) {
  const config =
    ANIMATIONS.find((item) => item.key === animation) ?? ANIMATIONS[0];
  const setImageRef = useCallback(
    (node: HTMLImageElement | null) => onImageRef(animation, node),
    [animation, onImageRef],
  );

  return (
    // A fixed action key and stable callback ref keep the decoded DOM node alive.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.spriteLayer}
      ref={setImageRef}
      src={petAnimationUrl(petId, animation)}
      alt=""
      aria-hidden="true"
      data-motion-target={animation}
      data-active={active && ready ? "true" : "false"}
      data-ready={ready ? "true" : "false"}
      draggable={false}
      loading="eager"
      fetchPriority={active || eager ? "high" : "auto"}
      decoding="async"
      onLoad={(event) => onReady(animation, event.currentTarget)}
      onError={(event) => onFailed(animation, event.currentTarget)}
      style={
        {
          "--sprite-columns": config.frames,
          "--sprite-x": "0%",
        } as SpriteStyle
      }
    />
  );
}

export function SpritePet({
  petId,
  animation = "idle",
  preloadAnimations = [],
  paused = false,
  eager = false,
  label,
  getAnimationLabel,
  onDisplayedAnimationChange,
  onAnimationError,
  className,
}: SpritePetProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef(new Map<AnimationKey, HTMLImageElement>());
  const decodeRequestsRef = useRef(new Map<AnimationKey, LayerDecodeRecord>());
  const readyAnimationsRef = useRef(new Set<AnimationKey>());
  const failedAnimationsRef = useRef(new Set<AnimationKey>());
  const onAnimationErrorRef = useRef(onAnimationError);
  const clockEpochRef = useRef(0);
  const frameStateRef = useRef<FrameState>({ animation, frame: 0 });
  const [canAnimate, setCanAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [readyAnimations, setReadyAnimations] = useState<
    ReadonlySet<AnimationKey>
  >(() => new Set());
  const [failedAnimations, setFailedAnimations] = useState<
    ReadonlySet<AnimationKey>
  >(() => new Set());
  const [displayedAnimation, setDisplayedAnimation] =
    useState<AnimationKey>(animation);

  const displayedConfig = useMemo(
    () =>
      ANIMATIONS.find((item) => item.key === displayedAnimation) ??
      ANIMATIONS[0],
    [displayedAnimation],
  );
  const renderedAnimations = [
    ...new Set<AnimationKey>([
      displayedAnimation,
      animation,
      ...preloadAnimations,
      ...readyAnimations,
    ]),
  ];

  const displayedReady = readyAnimations.has(displayedAnimation);
  const requestedFailed = failedAnimations.has(animation);
  const motionStatus = requestedFailed
    ? "error"
    : !displayedReady || animation !== displayedAnimation
      ? "loading"
      : "ready";

  const markLayerFailed = useCallback(
    (layerAnimation: AnimationKey, image: HTMLImageElement) => {
      if (imageRefs.current.get(layerAnimation) !== image) return;
      if (
        failedAnimationsRef.current.has(layerAnimation) &&
        !readyAnimationsRef.current.has(layerAnimation)
      ) {
        return;
      }
      decodeRequestsRef.current.delete(layerAnimation);
      const nextReadyAnimations = new Set(readyAnimationsRef.current);
      nextReadyAnimations.delete(layerAnimation);
      readyAnimationsRef.current = nextReadyAnimations;
      setReadyAnimations(nextReadyAnimations);

      const nextFailedAnimations = new Set(failedAnimationsRef.current);
      nextFailedAnimations.add(layerAnimation);
      failedAnimationsRef.current = nextFailedAnimations;
      setFailedAnimations(nextFailedAnimations);
    },
    [],
  );

  const prepareLayer = useCallback(
    (layerAnimation: AnimationKey, image: HTMLImageElement) => {
      imageRefs.current.set(layerAnimation, image);
      if (
        readyAnimationsRef.current.has(layerAnimation) ||
        !image.complete ||
        image.naturalWidth <= 0
      ) {
        return;
      }

      const existing = decodeRequestsRef.current.get(layerAnimation);
      if (existing?.image === image) return;

      const request =
        typeof image.decode === "function"
          ? image.decode()
          : Promise.resolve();
      decodeRequestsRef.current.set(layerAnimation, { image, promise: request });

      void request.then(
        () => {
          if (imageRefs.current.get(layerAnimation) !== image) return;
          decodeRequestsRef.current.delete(layerAnimation);
          if (readyAnimationsRef.current.has(layerAnimation)) return;

          image.style.setProperty("--sprite-x", "0%");
          const nextReadyAnimations = new Set(readyAnimationsRef.current);
          nextReadyAnimations.add(layerAnimation);
          readyAnimationsRef.current = nextReadyAnimations;
          setReadyAnimations(nextReadyAnimations);

          if (failedAnimationsRef.current.has(layerAnimation)) {
            const nextFailedAnimations = new Set(failedAnimationsRef.current);
            nextFailedAnimations.delete(layerAnimation);
            failedAnimationsRef.current = nextFailedAnimations;
            setFailedAnimations(nextFailedAnimations);
          }
        },
        () => markLayerFailed(layerAnimation, image),
      );
    },
    [markLayerFailed],
  );

  const registerLayerImage = useCallback(
    (layerAnimation: AnimationKey, node: HTMLImageElement | null) => {
      if (!node) {
        imageRefs.current.delete(layerAnimation);
        decodeRequestsRef.current.delete(layerAnimation);
        return;
      }

      imageRefs.current.set(layerAnimation, node);
      if (node.complete && node.naturalWidth > 0) {
        prepareLayer(layerAnimation, node);
      }
    },
    [prepareLayer],
  );

  useLayoutEffect(() => {
    onAnimationErrorRef.current = onAnimationError;
  }, [onAnimationError]);

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
    if (!rootRef.current || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (
      animation === displayedAnimation ||
      !readyAnimations.has(animation) ||
      !imageRefs.current.has(animation)
    ) {
      return;
    }

    setDisplayedAnimation(animation);
  }, [animation, displayedAnimation, readyAnimations]);

  useLayoutEffect(() => {
    if (!displayedReady) return;
    const image = imageRefs.current.get(displayedAnimation);
    if (!image) return;

    clockEpochRef.current += 1;
    frameStateRef.current = { animation: displayedAnimation, frame: 0 };
    image.style.setProperty("--sprite-x", "0%");
  }, [displayedAnimation, displayedReady]);

  useLayoutEffect(() => {
    onDisplayedAnimationChange?.(displayedAnimation);
  }, [displayedAnimation, onDisplayedAnimationChange]);

  useLayoutEffect(() => {
    if (!requestedFailed) return;
    onAnimationErrorRef.current?.(animation);
  }, [animation, requestedFailed]);

  useEffect(() => {
    const image = imageRefs.current.get(displayedAnimation);
    if (
      !image ||
      !displayedReady ||
      paused ||
      !canAnimate ||
      !isVisible
    ) {
      return;
    }

    const epoch = ++clockEpochRef.current;
    let frame =
      frameStateRef.current.animation === displayedAnimation
        ? frameStateRef.current.frame
        : 0;
    let deadline = performance.now() + (displayedConfig.durations[frame] ?? 170);
    let frameRequest = 0;

    const tick = (now: number) => {
      if (clockEpochRef.current !== epoch) return;

      if (now >= deadline) {
        frame = (frame + 1) % displayedConfig.frames;
        frameStateRef.current = { animation: displayedAnimation, frame };
        image.style.setProperty(
          "--sprite-x",
          `-${frame * (100 / displayedConfig.frames)}%`,
        );
        // Do not catch up by skipping several visual frames after a long task.
        deadline = now + (displayedConfig.durations[frame] ?? 170);
      }

      frameRequest = requestAnimationFrame(tick);
    };

    frameRequest = requestAnimationFrame(tick);
    return () => {
      if (clockEpochRef.current === epoch) clockEpochRef.current += 1;
      cancelAnimationFrame(frameRequest);
    };
  }, [
    canAnimate,
    displayedAnimation,
    displayedConfig,
    displayedReady,
    isVisible,
    paused,
  ]);

  return (
    <div
      className={[styles.spriteWindow, className].filter(Boolean).join(" ")}
      role="img"
      aria-label={
        getAnimationLabel?.(displayedAnimation) ??
        label ??
        `${petId} Codex pet`
      }
      aria-busy={motionStatus === "loading"}
      data-animation={displayedAnimation}
      data-requested-animation={animation}
      data-ready={displayedReady ? "true" : "false"}
      data-status={motionStatus}
      ref={rootRef}
    >
      {/* The preview remains underneath every persistent action layer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.spriteFallback}
        src={`/pets/${petId}/web/preview.webp`}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />

      {renderedAnimations.map((layerAnimation) => {
        const layerReady = readyAnimations.has(layerAnimation);

        return (
          <SpriteLayerImage
            key={`${petId}-${layerAnimation}`}
            petId={petId}
            animation={layerAnimation}
            active={displayedAnimation === layerAnimation}
            ready={layerReady}
            eager={eager || animation === layerAnimation}
            onImageRef={registerLayerImage}
            onReady={prepareLayer}
            onFailed={markLayerFailed}
          />
        );
      })}
    </div>
  );
}
