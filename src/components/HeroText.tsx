"use client";

type HeroTextProps = {
  progress: number;
  chapter: number;
};

const chapters = [
  {
    eyebrow: "01 / INTRODUCTION",
    title: "HI, I'M",
    highlight: "KENNETH.",
    description: "A full-stack web developer building digital experiences.",
    side: "left",
  },
  {
    eyebrow: "02 / CREATIVE DEVELOPMENT",
    title: "I BUILD",
    highlight: "DIGITAL EXPERIENCES.",
    description: "Where design, code, and motion come together.",
    side: "right",
  },
  {
    eyebrow: "03 / MY APPROACH",
    title: "DESIGN",
    highlight: "× CODE × MOTION",
    description: "Creating interfaces that feel alive and intentional.",
    side: "left",
  },
  {
    eyebrow: "04 / THE GOAL",
    title: "TURNING IDEAS",
    highlight: "INTO EXPERIENCES.",
    description: "Built to be useful. Designed to be remembered.",
    side: "right",
  },
];

export default function HeroText({ progress, chapter }: HeroTextProps) {
  const current = chapters[chapter] ?? chapters[0];

  const isLeft = current.side === "left";

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div
        key={chapter}
        className={`
          absolute
          top-1/2
          w-[calc(100%-4rem)]
          max-w-[620px]
          -translate-y-1/2

          md:w-[45%]

          ${
            isLeft
              ? "left-8 text-left md:left-16 lg:left-24"
              : "right-8 text-right md:right-16 lg:right-24"
          }
        `}
        style={{
          animation: "heroTextIn 0.6s ease-out forwards",
        }}
      >
        {/* Eyebrow */}
        <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.35em] text-white/40 md:text-xs">
          {current.eyebrow}
        </p>

        {/* Heading */}
        <h1 className="text-4xl font-medium leading-[0.92] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {current.title}
          <br />

          <span className="text-white/70">{current.highlight}</span>
        </h1>

        {/* Description */}
        <p
          className={`
            mt-6
            max-w-[420px]
            text-xs
            leading-relaxed
            tracking-wide
            text-white/40
            md:text-sm
            ${isLeft ? "" : "ml-auto"}
          `}
        >
          {current.description}
        </p>
      </div>

      {/* Chapter indicator */}
      <div
        className={`
          absolute
          bottom-8
          flex
          items-center
          gap-4

          ${isLeft ? "left-8 md:left-16" : "right-8 md:right-16"}
        `}
      >
        <span className="text-[9px] tracking-[0.3em] text-white/40">
          0{chapter + 1}
        </span>

        <div className="h-px w-12 bg-white/20" />

        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">
          Scroll / Arrow Keys
        </span>
      </div>

      <style jsx>{`
        @keyframes heroTextIn {
          from {
            opacity: 0;
            transform: translateY(-50%) scale(0.97);
            filter: blur(8px);
          }

          to {
            opacity: 1;
            transform: translateY(-50%) scale(1);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
}
