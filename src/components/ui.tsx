import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import {
  gsap,
  useGSAP,
  splitLines,
  prefersReduced,
  EASE,
} from "../lib/gsap";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ---------- Section heading: eyebrow settles, H2 line-mask reveal ---------- */
export function SectionHead({
  eyebrow,
  title,
  dark = false,
  className,
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const eb = useRef<HTMLParagraphElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      if (eb.current && !prefersReduced()) {
        gsap.from(eb.current, {
          opacity: 0,
          letterSpacing: "0.5em",
          duration: 0.6,
          ease: EASE.ink,
          scrollTrigger: { trigger: eb.current, start: "top 86%", once: true },
        });
      }
      splitLines(h2.current, {
        duration: 0.7,
        stagger: 0.07,
        scrollTrigger: { trigger: h2.current ?? root.current, start: "top 84%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className={className}>
      <p ref={eb} className={cn("eyebrow", dark && "on-dark")}>
        {eyebrow}
      </p>
      <h2
        ref={h2}
        className={cn(
          "mt-4 font-display font-black tracking-tight text-balance",
          "text-3xl sm:text-4xl lg:text-[44px] leading-[1.08]",
          dark ? "text-paper" : "text-ink"
        )}
      >
        {title}
      </h2>
    </div>
  );
}

/* ---------- Icon that redraws + tilts with a seal beat on card hover ---------- */
export function AnimatedIcon({ Icon, className }: { Icon: LucideIcon; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.closest("[data-hovercard]") as HTMLElement | null;
    const svg = ref.current?.querySelector("svg");
    if (!host || !svg) return;
    if (!window.matchMedia("(hover: hover)").matches || prefersReduced()) return;
    const parts = svg.querySelectorAll("path, circle, line, rect, polyline");
    const enter = () => {
      try {
        gsap.fromTo(
          parts,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.4, ease: EASE.ink, stagger: 0.03, overwrite: true }
        );
      } catch {
        /* drawSVG unavailable — skip flourish */
      }
      gsap.fromTo(ref.current, { rotate: -4 }, { rotate: 0, duration: 0.45, ease: EASE.seal, overwrite: true });
    };
    host.addEventListener("mouseenter", enter);
    return () => host.removeEventListener("mouseenter", enter);
  }, [Icon]);

  return (
    <span ref={ref} className={cn("inline-flex", className)}>
      <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

/* ---------- Dialog (portal so smoother transforms can't trap it) ---------- */
export function Modal({
  open,
  onClose,
  label,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(t);
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={label}>
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/45 cursor-default"
        onClick={onClose}
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,640px)] max-h-[84vh] overflow-y-auto",
          "bg-paper border border-line rounded-[16px] shadow-2xl outline-none",
          wide && "w-[min(94vw,820px)]"
        )}
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-3 border-b border-line sticky top-0 bg-paper z-10">
          <p className="eyebrow">{label}</p>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-muted hover:text-ink transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
