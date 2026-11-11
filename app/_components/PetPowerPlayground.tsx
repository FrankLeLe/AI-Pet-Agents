"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Pause, Play, RotateCcw, Sparkles } from "lucide-react";

import type { Language } from "@/lib/pets";
import { getPowerAssetUrl, getPowerFrameAtTime, POWER_SPRITE } from "@/lib/pet-powers";
import type { PetPower } from "@/lib/pet-powers";
import { SpritePet } from "./SpritePet";
import styles from "./pet-power-playground.module.css";

type Phase = "resting" | "loading" | "transforming" | "awakened";
type Sequence = "transform" | "awakened";
const SEQUENCES: readonly Sequence[] = ["transform", "awakened"];

type Props = { language: Language; petName: string; power: PetPower };

export function PetPowerPlayground({ language, petName, power }: Props) {
  const [phase, setPhase] = useState<Phase>("resting");
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState<ReadonlySet<Sequence>>(() => new Set());
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef(new Map<Sequence, HTMLImageElement>());
  const readyRef = useRef(new Set<Sequence>());
  const errorRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const clockRef = useRef({ phase, elapsed: 0 });
  const active = phase === "transforming" || phase === "awakened";
  const busy = phase === "loading" || phase === "transforming";
  const translate = (zh: string, en: string) => language === "zh" ? zh : en;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotionRef.current = preference.matches;
      setReducedMotion(preference.matches);
      if (preference.matches) setPhase((current) => current === "transforming" ? "awakened" : current);
    };
    const updateVisibility = () => setPageVisible(!document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!stageRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  const markFailed = useCallback((sequence: Sequence, image: HTMLImageElement) => {
    if (imagesRef.current.get(sequence) !== image) return;
    errorRef.current = true;
    setError(true);
    setPhase("resting");
    const next = new Set(readyRef.current);
    next.delete(sequence);
    readyRef.current = next;
    setReady(next);
  }, []);

  const prepareImage = useCallback((sequence: Sequence, image: HTMLImageElement) => {
    const decode = typeof image.decode === "function" ? image.decode() : Promise.resolve();
    void decode.then(() => {
      if (imagesRef.current.get(sequence) !== image || image.naturalWidth <= 0) return;
      const next = new Set([...readyRef.current, sequence]);
      readyRef.current = next;
      setReady(next);
      if (!errorRef.current && SEQUENCES.every((item) => next.has(item))) {
        setPhase((current) => current === "loading"
          ? reducedMotionRef.current ? "awakened" : "transforming"
          : current);
      }
    }, () => markFailed(sequence, image));
  }, [markFailed]);

  useLayoutEffect(() => {
    clockRef.current = { phase, elapsed: 0 };
    for (const image of imagesRef.current.values()) {
      image.style.setProperty("--power-x", "0%");
      image.dataset.frame = "0";
    }
  }, [phase]);

  useEffect(() => {
    if (!active || paused || reducedMotion || !visible || !pageVisible) return;
    const sequence = phase === "transforming" ? "transform" : "awakened";
    const image = imagesRef.current.get(sequence);
    if (!image || !ready.has(sequence)) return;
    const durations = phase === "transforming"
      ? POWER_SPRITE.transformDurations
      : POWER_SPRITE.awakenedDurations;
    let last = performance.now();
    let request = 0;
    const tick = (now: number) => {
      if (clockRef.current.phase !== phase) return;
      // A throttled browser must not skip the authored transformation poses.
      clockRef.current.elapsed += Math.min(Math.max(0, now - last), 64);
      last = now;
      const { frame, complete } = getPowerFrameAtTime(
        clockRef.current.elapsed, durations, phase === "awakened",
      );
      image.style.setProperty("--power-x", `-${frame * (100 / POWER_SPRITE.frames)}%`);
      image.dataset.frame = String(frame);
      if (complete) {
        setPhase("awakened");
        return;
      }
      request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [active, pageVisible, paused, phase, ready, reducedMotion, visible]);

  const activate = () => {
    if (busy) return;
    setPaused(false);
    setRequested(true);
    if (error) {
      errorRef.current = false;
      setError(false);
      readyRef.current = new Set();
      setReady(new Set());
      setAttempt((current) => current + 1);
      setPhase("loading");
    } else if (SEQUENCES.every((sequence) => ready.has(sequence))) {
      setPhase(reducedMotion ? "awakened" : "transforming");
    } else {
      setPhase("loading");
    }
  };

  const status = error
    ? translate("暂时没准备好，再试一次吧。", "Not quite ready. Give it another try.")
    : phase === "loading"
      ? translate("准备一下…", "Getting ready…")
      : phase === "transforming"
        ? translate("力量正在展开", "Power unfolding")
        : phase === "awakened" ? power.name[language] : power.restingName[language];

  return (
    <section className={styles.power} id="powers" aria-labelledby="power-title"
      style={{
        "--power-color": power.color,
        "--power-rest-scale": power.restingScale,
        "--power-rest-y": `${power.restingOffsetY}%`,
      } as CSSProperties}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>BLEACH · {translate("力量展开", "POWER UNFOLDS")}</p>
        <h2 id="power-title">{power.name[language]}</h2>
        <p>{power.description[language]}</p>
        <div className={styles.controls}>
          <button type="button" className={styles.primary} onClick={activate} disabled={busy}
            aria-controls="power-stage" aria-busy={busy} data-power-action="activate">
            <Sparkles size={19} aria-hidden="true" />
            {phase === "loading" ? translate("准备一下…", "Getting ready…")
              : phase === "transforming" ? translate("正在展开", "Unfolding")
                : phase === "awakened" ? translate("再看一次", "Replay") : power.action[language]}
          </button>
          {active ? (
            <button type="button" onClick={() => setPaused((current) => !current)}
              disabled={reducedMotion} aria-pressed={paused} data-power-action="pause">
              {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
              {paused ? translate("继续动作", "Resume") : translate("暂停动作", "Pause")}
            </button>
          ) : null}
          {phase !== "resting" ? (
            <button type="button" data-power-action="rest" onClick={() => {
              setPhase("resting");
              setPaused(false);
            }}>
              <RotateCcw size={17} aria-hidden="true" />
              {translate("回到日常", "Return to everyday")}
            </button>
          ) : null}
        </div>
        <p className={styles.hint}>
          {reducedMotion
            ? translate("已按你的动态偏好，直接展示展开后的姿态。", "Your motion preference is on: the final pose appears directly.")
            : translate("展开力量后，可以暂停欣赏，也可以随时回到日常。", "Pause to enjoy the new form, or return to everyday at any time.")}
        </p>
      </div>
      <div id="power-stage" className={styles.stage} ref={stageRef}
        data-power-phase={phase} data-power-paused={paused ? "true" : "false"}
        data-atmosphere={power.atmosphere} data-effects={active && !paused && !reducedMotion && visible && pageVisible ? "on" : "off"}>
        <div className={styles.stageHeader}>
          <span>{petName}</span>
          <strong role="status" aria-live="polite">{status}</strong>
        </div>
        <div className={styles.aura} aria-hidden="true" />
        <div className={styles.rings} aria-hidden="true" />
        <div className={styles.figure} role="img" aria-label={`${petName}：${active ? power.name[language] : power.restingName[language]}`}>
          <div className={styles.resting} data-shown={!active ? "true" : "false"}>
            <SpritePet petId={power.petId} paused animation="idle" label={petName} />
          </div>
          {requested ? SEQUENCES.map((sequence) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${sequence}-${attempt}`} src={getPowerAssetUrl(power.petId, sequence)} alt="" aria-hidden="true"
              ref={(image) => { if (image) imagesRef.current.set(sequence, image); else imagesRef.current.delete(sequence); }}
              onLoad={(event) => prepareImage(sequence, event.currentTarget)}
              onError={(event) => markFailed(sequence, event.currentTarget)}
              className={styles.sequence} draggable={false} decoding="async"
              data-power-sequence={sequence} data-frame="0"
              data-active={ready.has(sequence) && ((sequence === "transform" && phase === "transforming") || (sequence === "awakened" && phase === "awakened")) ? "true" : "false"}
            />
          )) : null}
        </div>
        <span className={styles.stageFootnote}>{translate("守护的心意，一直都在。", "The will to protect stays close.")}</span>
      </div>
    </section>
  );
}
