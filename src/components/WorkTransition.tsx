"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type WorkTransitionProps = {
    children: React.ReactNode;
};

export default function WorkTransition({
    children,
}: WorkTransitionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        const ctx = gsap.context(() => {
            const work = container.querySelector<HTMLElement>("#work");

            if (!work) return;

            gsap.set(work, {
                y: window.innerHeight,
            });

            gsap.to(work, {
                y: 0,
                ease: "none",

                scrollTrigger: {
                    trigger: container,

                    start: "top top",
                    end: "+=100vh",

                    scrub: 1,

                    pin: false,
                    pinSpacing: false,

                    invalidateOnRefresh: true,
                },
            });
        }, container);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative z-40 -mt-[100vh]"
        >
            {children}
        </div>
    );
}