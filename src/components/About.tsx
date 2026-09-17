"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";

import * as THREE from "three";

import Topography from "../components/Topography";
import ScrollVelocity from "../components/ScrollVelocity";

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  {
    number: "01",
    side: "left",
    eyebrow: "ABOUT ME",
    title: ["I BUILD", "DIGITAL", "EXPERIENCES."],
    description:
      "I'm a full-stack web developer focused on creating modern, interactive, and purposeful digital experiences.",
  },
  {
    number: "02",
    side: "right",
    eyebrow: "MY APPROACH",
    title: ["DESIGN.", "BUILD.", "REFINE."],
    description:
      "I combine thoughtful design with clean engineering to create interfaces that feel simple, fast, and intentional.",
  },
  {
    number: "03",
    side: "left",
    eyebrow: "WHAT I DO",
    title: ["FULL-STACK", "WEB", "DEVELOPMENT."],
    description:
      "From frontend interfaces to backend systems, I build complete digital products using modern web technologies.",
  },
  {
    number: "04",
    side: "right",
    eyebrow: "THE GOAL",
    title: ["MAKE IT", "USEFUL.", "MAKE IT MEMORABLE."],
    description:
      "Every project should have a purpose. I focus on building experiences that look refined and work beautifully.",
  },
];

function RotatingModel() {
  const headRef = useRef<THREE.Object3D>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { scene } = useGLTF("/untitled-6.glb");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / innerWidth) * 2 - 1,
        y: (e.clientY / innerHeight) * 2 - 1,
      };
    };

    window.addEventListener("mousemove", move);
    scene.traverse((o) => {
      if (o.name.toLowerCase() === "head") headRef.current = o;
    });

    return () => window.removeEventListener("mousemove", move);
  }, [scene]);

  useFrame(() => {
    if (!headRef.current) return;

    const { x, y } = mouse.current;
    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      x * 0.5,
      0.08,
    );
    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      y * 0.25,
      0.08,
    );
  });

  return (
    <group scale={2} position={[0, 0.075, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function About() {
  const stage = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const modelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stage.current || !section.current) return;
      gsap.set(section.current, {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
      });
      const sceneElements = sceneRefs.current.filter(
        Boolean,
      ) as HTMLDivElement[];

      const progressElements = progressRefs.current.filter(
        Boolean,
      ) as HTMLDivElement[];

      if (!sceneElements.length) return;
      gsap.set(sceneElements, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      gsap.set(sceneElements[0], {
        autoAlpha: 1,
        pointerEvents: "auto",
      });
      gsap.set(progressElements, {
        opacity: 0.25,
      });

      if (progressElements[0]) {
        gsap.set(progressElements[0], {
          opacity: 1,
        });
      }
      sceneElements.forEach((scene, index) => {
        const lines = scene.querySelectorAll(".about-title-line");

        const side = scenes[index]?.side;

        gsap.set(lines, {
          yPercent: 0,
          opacity: 0,
        });

        if (index === 0) {
          gsap.set(lines, {
            opacity: 1,
          });
        }

        if (index !== 0) {
          gsap.set(scene, {
            x: side === "left" ? -80 : 80,
          });
        }
      });
      if (modelRef.current) {
        gsap.set(modelRef.current, {
          y: 0,
          scale: 1,
        });
      }
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage.current,

          start: "top top",

          end: "+=400%",

          pin: true,

          scrub: 0.7,

          snap: {
            snapTo: (value) => {
              if (value <= 0.75) {
                return Math.round(value * 4) / 4;
              }

              return value;
            },

            duration: {
              min: 0.25,
              max: 0.5,
            },

            delay: 0.05,

            ease: "power2.out",
          },

          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < sceneElements.length; i++) {
        const previous = sceneElements[i - 1];

        const current = sceneElements[i];

        const previousSide = scenes[i - 1].side;

        const currentSide = scenes[i].side;

        const previousLines = previous.querySelectorAll(".about-title-line");

        const currentLines = current.querySelectorAll(".about-title-line");
        timeline.to(previous, {
          x: previousSide === "left" ? -100 : 100,

          autoAlpha: 0,

          duration: 0.45,

          ease: "power3.inOut",

          onStart: () => {
            gsap.set(previous, {
              pointerEvents: "none",
            });
          },
        });

        timeline.to(
          previousLines,
          {
            opacity: 0,

            yPercent: -20,

            duration: 0.25,

            ease: "power2.in",
          },
          "<",
        );

        timeline.set(current, {
          x: currentSide === "left" ? -100 : 100,

          autoAlpha: 1,

          pointerEvents: "auto",
        });

        timeline.to(
          current,
          {
            x: 0,

            duration: 0.55,

            ease: "power3.out",
          },
          "-=0.05",
        );

        timeline.fromTo(
          currentLines,
          {
            yPercent: 30,

            opacity: 0,
          },
          {
            yPercent: 0,

            opacity: 1,

            duration: 0.45,

            stagger: 0.07,

            ease: "power3.out",
          },
          "-=0.35",
        );

        if (progressElements[i - 1]) {
          timeline.to(
            progressElements[i - 1],
            {
              opacity: 0.25,

              duration: 0.15,
            },
            "-=0.35",
          );
        }

        if (progressElements[i]) {
          timeline.to(
            progressElements[i],
            {
              opacity: 1,

              duration: 0.15,
            },
            "<",
          );
        }
      }

      timeline.to(section.current, {
        clipPath: "inset(21% 29% 21% 29%)",

        duration: 1,

        ease: "none",
      });

      if (modelRef.current) {
        gsap.to(modelRef.current, {
          y: -120,

          scale: 0.9,

          ease: "none",

          scrollTrigger: {
            trigger: stage.current,

            start: "top top",

            end: "bottom top",

            scrub: 1,

            invalidateOnRefresh: true,
          },
        });
      }
    },
    {
      scope: stage,
    },
  );

  return (
    <main className="relative w-full bg-black">
      <div
        ref={stage}
        className="
          relative
          h-screen
          w-full
        "
      >
        <section
          className="
            absolute
            inset-0
            z-0
            flex
            h-screen
            w-full
            items-center
            justify-center
            overflow-hidden
                    bg-[#2f2f2f]
            text-white
          "
        >
          <ScrollVelocity
            texts={[
              <div className="stack-row" key="row-1">
                <span>React</span>
                <span>Next.js</span>
                <span>TypeScript</span>
                <span>JavaScript&nbsp;</span>
              </div>,

              <div className="stack-row" key="row-2">
                <span>Node.js</span>
                <span>Laravel</span>
                <span>PHP</span>
                <span>Tailwind CSS&nbsp;</span>
              </div>,

              <div className="stack-row" key="row-3">
                <span>GSAP</span>
                <span>Three.js</span>
                <span>MySQL</span>
                <span>PostgreSQL&nbsp;</span>
              </div>,
            ]}
            velocity={100}
            className="custom-scroll-text"
            numCopies={6}
            damping={50}
            stiffness={400}
          />
        </section>

        <section
          ref={section}
          className="
            relative
            z-10
            h-screen
            w-full
            overflow-hidden
        bg-[#cccccc]
            text-black
          "
        >
          <div
            className="
              absolute
              left-6
              top-10
              z-30
              md:left-10
              md:top-12
            "
          >
            <p
              className="
                text-xs
                uppercase
                tracking-[0.35em]
                text-black/40
                md:text-sm
              "
            >
              About
            </p>
          </div>

          <div
            className="
              absolute
              right-6
              top-1/2
              z-30
              flex
              -translate-y-1/2
              flex-col
              gap-4
              md:right-10
            "
          >
            {scenes.map((scene, index) => (
              <div
                key={scene.number}
                ref={(element) => {
                  progressRefs.current[index] = element;
                }}
                className="
                  flex
                  items-center
                  gap-3
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                "
              >
                <span>{scene.number}</span>

                <span className="hidden h-px w-6 bg-black/30 md:block" />
              </div>
            ))}
          </div>

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-0
            "
          >
            <Topography
              lowColor="#94a3b8"
              midColor="#94a3b8"
              highColor="#94a3b8"
              speed={0.45}
              morphAmount={3}
              morphSpeed={0.05}
              bands={1}
              thickness={0.01}
              scale={2}
              pixelSize={1}
              glow={0}
              colorMode="elevation"
              contrast={3}
              brightness={0.25}
              fillBands={false}
              opacity={0.5}
              grain
              grainIntensity={0}
              mouseInteraction
              mouseStrength={0.45}
            />
          </div>

          <div
            ref={modelRef}
            className="
              pointer-events-none
              absolute
              inset-0
              z-10
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-screen
                w-screen
                -translate-x-1/2
                -translate-y-1/2
              "
            >
              <Canvas
                camera={{
                  position: [0, 0, 5],
                  fov: 45,
                }}
                gl={{
                  antialias: true,
                  alpha: true,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <ambientLight intensity={2} />

                <directionalLight position={[5, 5, 5]} intensity={3} />

                <directionalLight position={[-5, 2, 3]} intensity={1.5} />

                <Environment preset="city" />

                <RotatingModel />
              </Canvas>
            </div>
          </div>

          <div
            className="
              relative
              z-20
              mx-auto
              flex
              h-full
              w-full
              max-w-[1800px]
              items-center
              px-6
              md:px-10
              lg:px-16
            "
          >
            {scenes.map((scene, index) => {
              const isLeft = scene.side === "left";

              return (
                <div
                  key={scene.number}
                  ref={(element) => {
                    sceneRefs.current[index] = element;
                  }}
                  className={`
                    absolute
                    top-1/2
                    -translate-y-1/2

                    w-[calc(50%-40px)]
                    max-w-[520px]

                    ${
                      isLeft
                        ? "left-6 md:left-10 lg:left-16 xl:left-[4vw]"
                        : "right-6 md:right-10 lg:right-16 xl:right-[4vw]"
                    }
                  `}
                >
                  <div className="mb-6 md:mb-8">
                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-[0.3em]
                        text-black/40
                        md:text-xs
                        md:tracking-[0.35em]
                      "
                    >
                      {scene.number} / {scene.eyebrow}
                    </p>
                  </div>
                  <h2
                    className="
                      text-[clamp(2.8rem,5vw,6rem)]
                      font-medium
                      leading-[0.84]
                      tracking-[-0.07em]
                    "
                  >
                    {scene.title.map((line, lineIndex) => (
                      <span
                        key={`${scene.number}-${lineIndex}`}
                        className={`
                          about-title-line
                          block

                          ${
                            lineIndex === scene.title.length - 1
                              ? "text-black/25"
                              : ""
                          }
                        `}
                      >
                        {line}
                      </span>
                    ))}
                  </h2>

                  <div
                    className={`
                      mt-8
                      max-w-[380px]
                      md:mt-10

                      ${
                        isLeft
                          ? "border-l border-black/15 pl-4 md:pl-5"
                          : "ml-auto border-r border-black/15 pr-4 text-right md:pr-5"
                      }
                    `}
                  >
                    <p
                      className="
                        text-xs
                        leading-[1.7]
                        text-black/50
                        md:text-sm
                        lg:text-base
                      "
                    >
                      {scene.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="
              absolute
              bottom-8
              left-6
              z-30
              flex
              items-center
              gap-4
              md:left-10
            "
          >
            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-black/30
              "
            >
              Scroll
            </span>

            <span className="h-px w-12 bg-black/20" />

            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-black/30
              "
            >
              Discover
            </span>
          </div>
        </section>
      </div>

      <section
        className="
          relative
          flex
          min-h-screen
          w-full
          items-center
          justify-center
              bg-[#2f2f2f]
          text-white
        "
      >
        <h2 className="text-6xl font-medium tracking-tight">SECTION 03</h2>
      </section>
    </main>
  );
}
