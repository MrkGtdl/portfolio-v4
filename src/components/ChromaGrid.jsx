"use client";

import { useRef } from "react";
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
}) {
  const rootRef = useRef(null);
  const cardsRef = useRef([]);
  const activeCardRef = useRef(null);

  const data = items?.length ? items : demo;

  const setCardRef = (el, index) => {
    cardsRef.current[index] = el;
  };

  const activateCard = (card, clientX, clientY) => {
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    /*
     * If a different card becomes active,
     * completely disable the previous one.
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

    /*
     * Only the card currently under
     * the pointer receives movement updates.
     */
    activateCard(card, e.clientX, e.clientY);
  };

  const handleGridMove = (e) => {
    /*
     * We only use grid movement to keep the
     * last active card alive while crossing gaps.
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
     * DON'T deactivate here.
     *
     * This allows the chroma to continue
     * while the pointer is crossing the gap.
     */
  };

  const handleGridLeave = () => {
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
          className="chroma-card"
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
        </article>
      ))}
    </div>
  );
}