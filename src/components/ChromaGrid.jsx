"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

const demo = [
  {
    image: "https://i.pravatar.cc/300?img=8",
    title: "Alex Rivera",
    subtitle: "Full Stack Developer",
    handle: "@alexrivera",
    borderColor: "#4F46E5",
    gradient: "linear-gradient(145deg, #4F46E5, #000)",
  },
  {
    image: "https://i.pravatar.cc/300?img=s11",
    title: "Jordan Chen",
    subtitle: "DevOps Engineer",
    handle: "@jordanchen",
    borderColor: "#10B981",
    gradient: "linear-gradient(210deg, #10B981, #000)",
  },
  {
    image: "https://i.pravatar.cc/300?img=3",
    title: "Morgan Blake",
    subtitle: "UI/UX Designer",
    handle: "@morganblake",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(165deg, #F59E0B, #000)",
  },
  {
    image: "https://i.pravatar.cc/300?img=16",
    title: "Casey Park",
    subtitle: "Data Scientist",
    handle: "@caseypark",
    borderColor: "#EF4444",
    gradient: "linear-gradient(195deg, #EF4444, #000)",
  },
];

export default function ChromaGrid({
  items,
  className = "",
  radius = 300,
  columns = 2,
  rows = 2,
  activeIndex = null,
}) {
  const rootRef = useRef(null);
  const cardsRef = useRef([]);
  const activeCardRef = useRef(null);

  /*
   * GSAP controls .chroma-motion
   * Menu hover controls .chroma-card
   */
  const motionRef = useRef([]);

  const data = items?.length ? items : demo;

  /*
   * --------------------------------
   * GSAP GRID MOTION
   * --------------------------------
   */

useEffect(() => {
  if (!rootRef.current) return;

  const cards = cardsRef.current;

  motionRef.current = cards.map((card) => {
    if (!card) return null;

    return {
      x: gsap.quickTo(card, "--gsap-x", {
        duration: 0.8,
        ease: "power3.out",
      }),

      y: gsap.quickTo(card, "--gsap-y", {
        duration: 0.9,
        ease: "power3.out",
      }),
    };
  });

  return () => {
    cards.forEach((card) => {
      if (!card) return;

      gsap.killTweensOf(card);
    });
  };
}, [data.length]);

const handleGridMotion = (e) => {
  const root = rootRef.current;

  if (!root) return;

  const rect = root.getBoundingClientRect();

  const mouseY = e.clientY - rect.top;

  const normalizedY =
    (mouseY / rect.height) * 2 - 1;

  const maxY = 80;

  const yMovement = normalizedY * maxY;

  /*
   * 2x2
   *
   * [ 0 ] [ 1 ]
   * [ 2 ] [ 3 ]
   *
   * LEFT  = same direction
   * RIGHT = opposite direction
   */

  const movements = [
    {
      x: 0,
      y: yMovement,
    },
    {
      x: 0,
      y: -yMovement,
    },
    {
      x: 0,
      y: yMovement,
    },
    {
      x: 0,
      y: -yMovement,
    },
  ];

  motionRef.current.forEach((motion, index) => {
    if (!motion) return;

    const movement = movements[index];

    if (!movement) return;

    motion.x(`${movement.x}px`);
    motion.y(`${movement.y}px`);
  });
};

  const resetGridMotion = () => {
    motionRef.current.forEach((motion) => {
      if (!motion) return;

      motion.x(0);
      motion.y(0);
    });
  };

  /*
   * --------------------------------
   * CARD REFS
   * --------------------------------
   */

  const setCardRef = (el, index) => {
    cardsRef.current[index] = el;
  };

  /*
   * --------------------------------
   * CHROMA HOVER
   * --------------------------------
   */

  const activateCard = (card, clientX, clientY) => {
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    /*
     * Disable previous card.
     */
    if (activeCardRef.current !== card) {
      cardsRef.current.forEach((item) => {
        if (!item || item === card) return;

        item.style.setProperty("--chroma-active", "0");
        item.style.setProperty("--mouse-x", "-9999px");
        item.style.setProperty("--mouse-y", "-9999px");
      });

      activeCardRef.current = card;
    }

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    card.style.setProperty("--chroma-radius", `${radius}px`);
    card.style.setProperty("--chroma-active", "1");
  };

  const handleCardEnter = (e) => {
    const card = e.currentTarget;

    activateCard(card, e.clientX, e.clientY);
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;

    activateCard(card, e.clientX, e.clientY);
  };

  const handleGridMove = (e) => {
    /*
     * GSAP movement
     */
    handleGridMotion(e);

    /*
     * Chroma reveal
     */
    const activeCard = activeCardRef.current;

    if (!activeCard) return;

    const rect = activeCard.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    activeCard.style.setProperty("--mouse-x", `${x}px`);
    activeCard.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleCardLeave = () => {
    /*
     * Do not deactivate here.
     *
     * This keeps the reveal active
     * while crossing the gap.
     */
  };

  const handleGridLeave = () => {
    /*
     * Reset GSAP movement
     */
    resetGridMotion();

    /*
     * Reset chroma
     */
    const activeCard = activeCardRef.current;

    if (activeCard) {
      activeCard.style.setProperty("--chroma-active", "0");
      activeCard.style.setProperty("--mouse-x", "-9999px");
      activeCard.style.setProperty("--mouse-y", "-9999px");
    }

    activeCardRef.current = null;
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        "--cols": columns,
        "--rows": rows,
      }}
      onPointerMove={handleGridMove}
      onPointerLeave={handleGridLeave}
    >
      {data.map((item, index) => (
        <article
          key={`${item.title}-${index}`}
          ref={(el) => setCardRef(el, index)}
          className={`chroma-card ${
            activeIndex === null
              ? ""
              : index === activeIndex
                ? "menu-active"
                : "menu-inactive"
          }`}
          onPointerEnter={handleCardEnter}
          onPointerMove={handleCardMove}
          onPointerLeave={handleCardLeave}
          style={{
            "--card-border": item.borderColor || "transparent",
            "--card-gradient":
              item.gradient ||
              "linear-gradient(145deg, #111, #000)",
          }}
        >
          <div className="chroma-clip">
            <div className="chroma-motion">
              <div className="chroma-img-wrapper">
                <img
                  className="chroma-img chroma-img-base"
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                />

                <img
                  className="chroma-img chroma-img-color"
                  src={item.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
              </div>

              <div className="chroma-card-shine" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}