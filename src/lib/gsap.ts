import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  DrawSVGPlugin,
  MotionPathPlugin,
  CustomEase
);

/* Signature eases — motion feels authored, not default */
CustomEase.create("ink", "M0,0 C0.16,1 0.3,1 1,1");
CustomEase.create("seal", "M0,0 C0.34,1.56 0.64,1 1,1");
CustomEase.create("glide", "M0,0 C0.65,0 0.35,1 1,1");

export const EASE = { ink: "ink", seal: "seal", glide: "glide" } as const;
export const DUR = { fast: 0.35, base: 0.6, slow: 1.1, epic: 1.6 } as const;
export const MQ = {
  full: "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
  lite: "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
  static: "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MotionPathPlugin };

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.static).matches;

/* Scroll to a section, honouring ScrollSmoother when present */
export function scrollToId(id: string) {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(`#${id}`, true, "top 96px");
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
}

/* Universal entrance: fade + 24px rise, once */
export function revealUp(
  el: Element | Element[] | null,
  opts: { y?: number; duration?: number; delay?: number; start?: string } = {}
) {
  if (!el || prefersReduced()) return;
  gsap.from(el, {
    opacity: 0,
    y: opts.y ?? 24,
    duration: opts.duration ?? DUR.base,
    ease: EASE.ink,
    delay: opts.delay ?? 0,
    scrollTrigger: { trigger: el as gsap.DOMTarget, start: opts.start ?? "top 82%", once: true },
  });
}

/* SplitText line-mask reveal (H1/H2 signature). Falls back to a plain rise. */
export function splitLines(
  el: Element | null,
  opts: { duration?: number; stagger?: number; scrollTrigger?: ScrollTrigger.Vars; delay?: number } = {}
) {
  if (!el) return;
  if (prefersReduced()) return;
  try {
    SplitText.create(el as gsap.DOMTarget, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self: SplitText) {
        return gsap.from(self.lines, {
          yPercent: 110,
          opacity: 0,
          duration: opts.duration ?? 0.9,
          stagger: opts.stagger ?? 0.09,
          ease: EASE.ink,
          delay: opts.delay ?? 0,
          scrollTrigger: opts.scrollTrigger,
        });
      },
    });
  } catch {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: EASE.ink,
      scrollTrigger: opts.scrollTrigger,
    });
  }
}

/* DrawSVG batch for any [data-draw] strokes inside a scope */
export function drawIn(
  scope: Element | null,
  opts: {
    selector?: string;
    duration?: number;
    stagger?: number;
    delay?: number;
    scrollTrigger?: ScrollTrigger.Vars;
  } = {}
) {
  if (!scope) return;
  const paths = scope.querySelectorAll(opts.selector ?? "[data-draw]");
  if (!paths.length) return;
  if (prefersReduced()) {
    gsap.set(paths, { drawSVG: "100%" });
    return;
  }
  gsap.from(paths, {
    drawSVG: "0%",
    duration: opts.duration ?? 1.1,
    ease: EASE.ink,
    stagger: opts.stagger ?? 0.08,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.scrollTrigger ?? { trigger: scope, start: "top 80%", once: true },
  });
}

/* Indian-grouping count-up with zero layout shift */
export function countUp(el: HTMLElement | null, target: number, onComplete?: () => void) {
  if (!el) return;
  if (prefersReduced()) {
    el.textContent = target.toLocaleString("en-IN");
    onComplete?.();
    return;
  }
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: "power2.out",
    snap: { val: 1 },
    onUpdate: () => {
      el.textContent = Math.floor(obj.val).toLocaleString("en-IN");
    },
    onComplete,
    scrollTrigger: { trigger: el, start: "top 84%", once: true },
  });
}

/* Lightweight cross-component event bus (filters, prefills) */
export const EVT_FILTER = "complianto:filter";
export const EVT_PREFILL = "complianto:prefill";
export const emit = (name: string, detail?: unknown) =>
  window.dispatchEvent(new CustomEvent(name, { detail }));
export const listen = (name: string, fn: (detail: unknown) => void) => {
  const handler = (e: Event) => fn((e as CustomEvent).detail);
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
};
