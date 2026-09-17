"use client";

type IntroSceneProps = {
  progress: number;
};

export default function IntroScene({ progress }: IntroSceneProps) {
  const p = Math.max(0, Math.min(progress, 1));

  /*

* INTRO TIMELINE
*
* 0.00 → 0.45
* Full white
*
* 0.45 → 0.70
* Slow compression
*
* 0.70 → 0.86
* Strong compression
*
* 0.86 → 0.94
* Final compression
*
* 0.94 → 1.00
* Tiny core
  */

  let scale = 1;

  if (p < 0.45) {
    scale = 1;
  } else if (p < 0.7) {
    /*

* PHASE 1
* Slow compression
  */
    const t = (p - 0.45) / 0.25;

    const eased = t * t * (3 - 2 * t);

    scale = 1 - eased * 0.62;
  } else if (p < 0.86) {
    /*

* PHASE 2
* Strong compression
  */
    const t = (p - 0.7) / 0.16;

    const eased = t * t * (3 - 2 * t);

    scale = 0.38 - eased * 0.3;
  } else if (p < 0.94) {
  } else if (p < 0.94) {
    /*

* PHASE 3
* Final compression
  */
    const t = (p - 0.86) / 0.08;

    /*
     * Ease-in.
     *
     * Starts slow, then accelerates
     * toward the center.
     */
    const eased = t * t * t;

    scale = 0.08 - eased * 0.065;
  } else {
    /*

* PHASE 4
* Tiny particle core
  */
    const t = (p - 0.94) / 0.06;

    const eased = t * t * (3 - 2 * t);

    scale = 0.015 - eased * 0.01;
  }

  /*

* Never completely disappear.
  */
  scale = Math.max(scale, 0.005);

  /*

* Shape gradually becomes circular.
  */
  const radius = p < 0.55 ? 0 : Math.min(50, ((p - 0.55) / 0.45) * 50);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="h-full w-full bg-white"
        style={{
          transform: `scale(${scale})`,
          borderRadius: `${radius}%`,
          transformOrigin: "center center",
        }}
      />{" "}
    </div>
  );
}
