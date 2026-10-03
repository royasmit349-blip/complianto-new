import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, ScrollTrigger, MQ, EASE } from "../lib/gsap";

/* THE Compliance Line — one continuous stroke entering at the hero and
   terminating at the consultation form, drawing itself with page scroll.
   A seal-marker rides it; nodes ignite as it passes. Once lit, stays lit. */

const W = 1440;
const H = 8000;

const PTS: [number, number][] = [
  [720, -80],
  [1005, 780],
  [575, 1480],
  [1015, 2150],
  [450, 2930],
  [1015, 3650],
  [720, 4300],
  [460, 5080],
  [720, 5800],
  [990, 6500],
  [470, 7180],
  [720, 7860],
];

const NODES: { at: number; label: string; dark?: boolean }[] = [
  { at: 1, label: "IDEA" },
  { at: 3, label: "01 · START" },
  { at: 4, label: "02 · MANAGE" },
  { at: 5, label: "03 · SCALE" },
  { at: 6, label: "FILE" },
  { at: 7, label: "AUDIT" },
  { at: 8, label: "TRACK", dark: true },
  { at: 9, label: "PEOPLE" },
  { at: 10, label: "LEARN" },
  { at: 11, label: "LET'S TALK" },
];

/* Catmull-Rom → cubic béziers for a smooth authored curve */
function pathFromPoints(pts: [number, number][]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1x = Math.round(p1[0] + (p2[0] - p0[0]) / 6);
    const c1y = Math.round(p1[1] + (p2[1] - p0[1]) / 6);
    const c2x = Math.round(p2[0] - (p3[0] - p1[0]) / 6);
    const c2y = Math.round(p2[1] - (p3[1] - p1[1]) / 6);
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const PATH_D = pathFromPoints(PTS);

function ignite(node: HTMLElement) {
  node.classList.add("is-lit");
  const dot = node.querySelector(".node-dot");
  const halo = node.querySelector(".node-halo");
  const label = node.querySelector(".node-label");
  const tick = node.querySelector(".node-tick");
  const leftSide = node.classList.contains("side-left");
  if (dot) gsap.fromTo(dot, { scale: 0.6 }, { scale: 1, duration: 0.45, ease: EASE.seal, overwrite: true });
  if (halo) gsap.fromTo(halo, { scale: 0.5, opacity: 0.55 }, { scale: 2.6, opacity: 0, duration: 0.7, ease: "power2.out", overwrite: true });
  if (label) gsap.fromTo(label, { opacity: 0, x: leftSide ? 8 : -8 }, { opacity: 1, x: 0, duration: 0.4, ease: EASE.ink, overwrite: true, clearProps: "transform" });
  if (tick) gsap.fromTo(tick, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: EASE.ink, delay: 0.05, overwrite: true });
}

export function ComplianceLine() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* FULL — desktop, motion allowed: master scrub timeline + marker */
      mm.add(MQ.full, () => {
        gsap.set(["#line-live", "#line-glow"], { drawSVG: "0%" });
        gsap.set("#line-marker", { opacity: 1, x: PTS[0][0], y: 0 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: "#smooth-content",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .to("#line-live", { drawSVG: "100%", ease: "none" }, 0)
          .to("#line-glow", { drawSVG: "100%", ease: "none" }, 0)
          .to(
            "#line-marker",
            {
              motionPath: {
                path: "#line-live",
                align: "#line-live",
                alignOrigin: [0.5, 0.5],
                autoRotate: false,
              },
              ease: "none",
            },
            0
          );

        /* Node ignition — one lightweight trigger per node, once only */
        const nodes = rootRef.current?.querySelectorAll<HTMLElement>("[data-node]") ?? [];
        nodes.forEach((node) => {
          ScrollTrigger.create({
            trigger: node,
            start: "top 78%",
            once: true,
            onEnter: () => ignite(node),
          });
        });

        /* The line switches to accent-soft while crossing the dark section */
        ScrollTrigger.create({
          trigger: "#deadlines",
          start: "top 55%",
          end: "bottom 45%",
          toggleClass: { targets: "#line-svg", className: "line-dark" },
        });
      });

      /* LITE — mobile: fully drawn line, nodes ignite simply, no scrub/marker */
      mm.add(MQ.lite, () => {
        gsap.set(["#line-live", "#line-glow"], { drawSVG: "100%" });
        gsap.set("#line-marker", { opacity: 0 });
        const nodes = rootRef.current?.querySelectorAll<HTMLElement>("[data-node]") ?? [];
        nodes.forEach((node) => {
          ScrollTrigger.create({
            trigger: node,
            start: "top 85%",
            once: true,
            onEnter: () => ignite(node),
          });
        });
      });

      /* STATIC — reduced motion: final state instantly */
      mm.add(MQ.static, () => {
        gsap.set(["#line-live", "#line-glow"], { drawSVG: "100%" });
        gsap.set("#line-marker", { opacity: 0 });
        rootRef.current?.querySelectorAll<HTMLElement>("[data-node]").forEach((n) => n.classList.add("is-lit"));
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <svg
        id="line-svg"
        className="absolute inset-0 hidden h-full w-full md:block"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="lineBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {/* ghost — full route, faint, so the shape always reads */}
        <path id="line-ghost" d={PATH_D} stroke="var(--color-line)" strokeWidth="2" fill="none" />
        {/* glow — the live wire */}
        <path id="line-glow" d={PATH_D} stroke="var(--color-accent)" strokeWidth="8" opacity="0.16" filter="url(#lineBlur)" fill="none" />
        {/* live — drawn by scroll */}
        <path id="line-live" d={PATH_D} stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* marker — a small seal riding the path */}
        <g id="line-marker" opacity="0">
          <circle r="13" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.4" />
          <circle r="7" fill="var(--color-accent)" />
          <path d="M-3.5 0.5 L-1 3 L4 -2.5" stroke="var(--color-accent-ink)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>

      {/* Mobile: static vertical rail at left 24px */}
      <div className="absolute bottom-0 left-6 top-0 w-[2px] bg-line md:hidden">
        <div className="h-full w-full bg-accent opacity-60" />
      </div>

      {/* Nodes — HTML so labels never distort under the stretched SVG */}
      {NODES.map((n) => {
        const [x, y] = PTS[n.at];
        const side = x > 720 ? "side-right" : "side-left";
        return (
          <div
            key={n.label}
            data-node
            className={`compliance-node ${side} ${n.dark ? "on-dark" : ""}`}
            style={{ "--nx": `${(x / W) * 100}%`, "--ny": `${(y / H) * 100}%` } as CSSProperties}
          >
            <span className="node-halo" />
            <span className="node-dot" />
            <span className="node-tick" />
            <span className="node-label">{n.label}</span>
          </div>
        );
      })}
    </div>
  );
}
