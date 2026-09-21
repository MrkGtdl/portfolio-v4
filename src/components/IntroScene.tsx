"use client";

import SplitFlapText from "./SplitFlapText";
import PixelBlast from "./PixelBlast";

type IntroSceneProps = {
  progress: number;
};

export default function IntroScene({ progress }: IntroSceneProps) {
  /*
   * =================================
   * INTRO PROGRESS
   *
   * 0 = full white world
   * 1 = particle handoff
   * =================================
   */
  const p = Math.max(0, Math.min(progress, 1));

  /*
   * =================================
   * RIGHTWARD MOVEMENT
   * =================================
   */
  const moveEase = p * p * (3 - 2 * p);

  const translateX = moveEase * 8;

  /*
   * =================================
   * WORLD SHRINK
   *
   * large → tiny
   * =================================
   */
  const shrinkStart = 0.02;
  const shrinkEnd = 0.3;

  const rawShrink = (p - shrinkStart) / (shrinkEnd - shrinkStart);

  const shrinkProgress = Math.max(0, Math.min(rawShrink, 1));

  /*
   * Cinematic easing.
   */
  const eased = 1 - Math.pow(1 - shrinkProgress, 3);

  /*
   * 100vw → 0.15vw
   */
  const size = 100 - eased * 99.85;

  /*
   * =================================
   * WORLD FADE
   *
   * Fade only near the particle handoff.
   * =================================
   */
  const fadeStart = 0.26;
  const fadeEnd = 0.42;

  const rawFade = (p - fadeStart) / (fadeEnd - fadeStart);

  const fadeProgress = Math.max(0, Math.min(rawFade, 1));

  const opacity = 1 - fadeProgress;

  /*
   * =================================
   * SPLIT FLAP + CTA SCALE
   * =================================
   */
  const textScale = Math.max(0, Math.min(size / 35, 1));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* =================================
          WHITE INTRO WORLD
      ================================= */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          className="relative flex items-center justify-center bg-white"
          style={{
            width: `${Math.max(size, 0.15)}vw`,
            height: `${Math.max(size, 0.15)}vw`,
            transform: `translateX(${translateX}vw)`,
            transformOrigin: "center center",
            opacity,
            overflow: "hidden",
          }}
        >
          {/* =================================
              PIXEL BLAST WORLD
          ================================= */}
          <div className="absolute inset-0 z-0">
            <PixelBlast
              variant="square"
              pixelSize={5}
              color="#000000"
              patternScale={1.75}
              patternDensity={1}
              pixelSizeJitter={0.1}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid={false}
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.5}
              edgeFade={0.25}
              transparent
            />
          </div>

          {/* =================================
              SPLIT FLAP + CTA
          ================================= */}
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center"
            style={{
              transform: `scale(${textScale})`,
              transformOrigin: "center center",
            }}
          >
            {/* =================================
                SPLIT FLAP NARRATION
            ================================= */}
            <SplitFlapText
              words={[
                "CODE INTO CREATION",
                "IDEAS INTO SYSTEMS",
                "SYSTEMS INTO SCALE",
              ]}
              flipDuration={0.12}
              stagger={0.06}
              cycleDelay={2400}
              charset="alphanumeric"
              flipsPerChar={8}
              tileColor="#111827"
              textColor="#f8fafc"
              tileRadius={8}
              gap={6}
              fontSize={52}
              loop
              padTo={0}
            />

            {/* =================================
                CTA BUTTONS
            ================================= */}
            <div className="pointer-events-auto mt-8 flex items-center gap-4">
              {/* GET STARTED */}
              <button
                type="button"
                className="
                  rounded-lg
                  border
                  border-[#111827]
                  bg-[#111827]
                  px-7
                  py-3
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-white
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-white
                  hover:text-[#111827]
                "
              >
                Get Started
              </button>

              {/* LEARN MORE */}
              <button
                type="button"
                className="
                  rounded-lg
                  border
                  border-[#111827]
                  bg-white
                  px-7
                  py-3
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-[#111827]
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-[#111827]
                  hover:text-white
                "
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
