"use client";

import { useState } from "react";
import StaggeredMenu from "./StaggeredMenu";

const menuItems = [
  {
    label: "Home",
    ariaLabel: "Go to home section",
    link: "#home",
    imageIndex: 0,
  },
  {
    label: "About",
    ariaLabel: "Go to about section",
    link: "#about",
    imageIndex: 1,
  },
  {
    label: "Work",
    ariaLabel: "Go to work section",
    link: "#work",
    imageIndex: 2,
  },
  {
    label: "Contact",
    ariaLabel: "Go to contact section",
    link: "#contact",
    imageIndex: 3,
  },
];

const socialItems = [
  {
    label: "GitHub",
    link: "https://github.com",
  },
  {
    label: "LinkedIn",
    link: "https://linkedin.com",
  },
];

export default function Header() {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="pointer-events-auto">
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials
          displayItemNumbering
          menuButtonColor="#ffffff"
          openMenuButtonColor="#111111"
          changeMenuColorOnOpen
          colors={["#ffffff", "#e5e5e5"]}
          accentColor="#111111"
          onItemHover={setHoveredImage}
        />
      </div>
    </div>
  );
}