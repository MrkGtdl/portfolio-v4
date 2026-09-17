"use client";

import { useEffect, useRef, useState } from "react";
import IntroScene from "./IntroScene";
import ParticleCanvas from "./ParticleCanvas";
import HeroText from "./HeroText";

const TOTAL_CHAPTERS = 5;

/*
 * Chapter mapping
 *
 * 0 = INTRO
 * 1 = 01
 * 2 = 02
 * 3 = 03
 * 4 = 04
 */
const CHAPTER_PROGRESS = [0, 1, 2, 3, 4];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState(0);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const chapterRef = useRef(0);

  /*
   * ============================
   * SMOOTH PROGRESS
   * ============================
   */
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      const current = currentProgressRef.current;
      const target = targetProgressRef.current;

      const next = current + (target - current) * 0.08;

      currentProgressRef.current = next;

      const safeNext = Number.isFinite(next) ? next : 0;

      setProgress(safeNext);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  /*
   * ============================
   * ARROW NAVIGATION
   * ============================
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }

      event.preventDefault();

      const currentChapter = chapterRef.current;

      let nextChapter = currentChapter;

      /*
       * DOWN
       */
      if (event.key === "ArrowDown") {
        nextChapter = Math.min(currentChapter + 1, TOTAL_CHAPTERS - 1);
      }

      /*
       * UP
       */
      if (event.key === "ArrowUp") {
        nextChapter = Math.max(currentChapter - 1, 0);
      }

      /*
       * Already at boundary.
       */
      if (nextChapter === currentChapter) {
        if (currentChapter === 0 && event.key === "ArrowUp") {
          targetProgressRef.current = 0;
          currentProgressRef.current = 0;
          setProgress(0);
        }

        return;
      }

      const nextProgress = CHAPTER_PROGRESS[nextChapter];

      if (!Number.isFinite(nextProgress)) {
        return;
      }

      /*
       * IMPORTANT:
       *
       * Update chapter immediately.
       * This prevents the text from lagging
       * behind the arrow navigation.
       */
      chapterRef.current = nextChapter;
      setChapter(nextChapter);

      /*
       * Smoothly move progress.
       */
      targetProgressRef.current = nextProgress;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * ============================
   * NORMAL SCROLL
   * ============================
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

      const scrollDistance =
        sectionRef.current.offsetHeight - window.innerHeight;

      const scrolled = Math.max(0, -rect.top);

      /*
       * IMPORTANT:
       *
       * 500vh section gives us
       * 4 chapter intervals.
       *
       * 0 → INTRO
       * 1 → 01
       * 2 → 02
       * 3 → 03
       * 4 → 04
       */
      const rawValue = scrollDistance > 0 ? (scrolled / scrollDistance) * 4 : 0;

      const value = Number.isFinite(rawValue)
        ? Math.min(Math.max(rawValue, 0), 4)
        : 0;

      targetProgressRef.current = value;

      /*
       * ============================
       * CHAPTER DETECTION
       * ============================
       *
       * Each chapter occupies
       * roughly one progress unit.
       */
      let nextChapter = 0;

      if (value >= 3.5) {
        nextChapter = 4;
      } else if (value >= 2.5) {
        nextChapter = 3;
      } else if (value >= 1.5) {
        nextChapter = 2;
      } else if (value >= 0.5) {
        nextChapter = 1;
      } else {
        nextChapter = 0;
      }

      if (nextChapter !== chapterRef.current) {
        chapterRef.current = nextChapter;

        setChapter(nextChapter);
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  /*
   * ============================
   * SAFE PROGRESS
   * ============================
   */
  const safeProgress = Number.isFinite(progress) ? progress : 0;

  /*
   * ============================
   * INTRO
   * ============================
   */
  const introProgress = Math.min(Math.max(safeProgress, 0), 1);

  const introOpacity =
    safeProgress < 0.65 ? 1 : Math.max(0, 1 - (safeProgress - 0.65) / 0.35);

  /*
   * ============================
   * HERO TEXT
   * ============================
   */
  const rawTextOpacity = (safeProgress - 0.48) / 0.18;

  const textOpacity = Number.isFinite(rawTextOpacity)
    ? Math.min(Math.max(rawTextOpacity, 0), 1)
    : 0;

  return (
    <section ref={sectionRef} className="relative h-[500vh] bg-[#0a0a0a]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* DEBUG */}
        <div className="absolute left-6 top-6 z-[999] text-xl text-white">
          {safeProgress.toFixed(2)}
          {" / "}
          CHAPTER {chapter}
        </div>

        {/* =====================================
            PARTICLE / GLB
        ===================================== */}
        <div className="absolute inset-0 z-10">
          <ParticleCanvas progress={safeProgress} />

          {/* ===================================
              HERO TEXT
          =================================== */}
          <div
            className="absolute inset-0"
            style={{
              opacity: textOpacity,
            }}
          >
            <HeroText progress={safeProgress} chapter={chapter} />
          </div>
        </div>

        {/* =====================================
            INTRO SCENE
        ===================================== */}
        <div
          className="absolute inset-0 z-30"
          style={{
            opacity: introOpacity,
          }}
        >
          <IntroScene progress={introProgress} />
        </div>

        {/* =====================================
            NAVIGATION HINT
        ===================================== */}
        <div className="pointer-events-none absolute bottom-8 right-8 z-50 hidden md:block">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/30">
            <span>↑</span>
            <span>↓</span>
            <span>Navigate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
