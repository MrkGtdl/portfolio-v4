"use client";

type IntroSceneProps = {
  progress: number;
};

export default function IntroScene({ progress }: IntroSceneProps) {
  /*
   * INTRO PROGRESS
   *
   * 0 = full white
   * 1 = particle handoff
   */
  const p = Math.max(0, Math.min(progress, 1));

  /*
   * RIGHTWARD MOVEMENT
   *
   * Same direction as the particle scene.
   */
  const moveEase = p * p * (3 - 2 * p);

  const translateX = moveEase * 8;

  /*
   * REVERSE SCROLL EXPAND
   *
   * Instead of:
   *
   * small → large
   *
   * we do:
   *
   * large → small
   */

  const shrinkStart = 0.08;
  const shrinkEnd = 0.42;

  const rawShrink = (p - shrinkStart) / (shrinkEnd - shrinkStart);

  const shrinkProgress = Math.max(0, Math.min(rawShrink, 1));

  /*
   * Cinematic easing.
   *
   * Starts controlled,
   * accelerates,
   * then settles into the point.
   */
  const eased = 1 - Math.pow(1 - shrinkProgress, 3);

  /*
   * 100vw → 0.15vw
   */
  const size = 100 - eased * 99.85;

  /*
   * Fade the square near
   * the particle handoff.
   */
  const fadeStart = 0.34;
  const fadeEnd = 0.5;

  const rawFade = (p - fadeStart) / (fadeEnd - fadeStart);

  const fadeProgress = Math.max(0, Math.min(rawFade, 1));

  const opacity = 1 - fadeProgress;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="bg-white"
        style={{
          width: `${Math.max(size, 0.15)}vw`,
          height: `${Math.max(size, 0.15)}vw`,
          transform: `translateX(${translateX}vw)`,
          transformOrigin: "center center",
          opacity,
        }}
      />
    </div>
  );
}
