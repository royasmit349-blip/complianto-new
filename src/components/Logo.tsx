import { useEffect, useRef } from "react";
import { gsap, EASE, prefersReduced } from "../lib/gsap";
import { cn } from "./ui";

/* COMPLIANT⊙ — the final O is a seal: ring + check, the compliance stamp.
   Highlight bar sits behind the letters; tagline below (hidden when sm). */

const LETTERS = ["C", "O", "M", "P", "L", "I", "A", "N", "T"];

export function Logo({
  size = "md",
  intro = false,
  className,
}: {
  size?: "sm" | "md";
  intro?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  /* Desktop-only hover: seal spins, fills, checks pop; highlight swells. */
  useEffect(() => {
    if (intro || !root.current) return;
    if (!window.matchMedia("(hover: hover)").matches || prefersReduced()) return;
    const ring = root.current.querySelector("#seal-spin, .seal-spin");
    const fill = root.current.querySelector(".seal-fill");
    const check = root.current.querySelector(".seal-check");
    const hi = root.current.querySelector(".logo-highlight");
    if (!ring || !fill || !check || !hi) return;

    const enter = () => {
      gsap.to(ring, { rotate: 180, duration: 0.7, ease: EASE.glide, overwrite: true, transformOrigin: "center" });
      gsap.to(fill, { opacity: 1, duration: 0.3, overwrite: true });
      gsap.fromTo(check, { scale: 1 }, { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1, ease: EASE.seal, overwrite: true, transformOrigin: "center" });
      gsap.to(hi, { scaleX: 1.04, opacity: 0.32, duration: 0.3, overwrite: true });
    };
    const leave = () => {
      gsap.to(ring, { rotate: 0, duration: 0.7, ease: EASE.glide, overwrite: true });
      gsap.to(fill, { opacity: 0, duration: 0.3, overwrite: true });
      gsap.to(hi, { scaleX: 1, opacity: 0.22, duration: 0.3, overwrite: true });
    };
    root.current.addEventListener("mouseenter", enter);
    root.current.addEventListener("mouseleave", leave);
    return () => {
      root.current?.removeEventListener("mouseenter", enter);
      root.current?.removeEventListener("mouseleave", leave);
    };
  }, [intro, size]);

  const sealSize = size === "md" ? 24 : 20;

  return (
    <div
      ref={root}
      className={cn("relative inline-block select-none", size === "sm" && "logo-sm", className)}
      data-logo
    >
      {/* highlight bar behind the word */}
      <span
        className="logo-highlight absolute left-[-4px] right-[26px] top-[16%] h-[52%] rounded-[2px] bg-accent opacity-[0.22]"
        aria-hidden="true"
      />
      <span className="relative flex items-center">
        <span
          className={cn(
            "logo-word flex",
            size === "md" ? "text-[21px]" : "text-[18px]"
          )}
        >
          {LETTERS.map((l, i) => (
            <span key={i} data-logo-letter className="inline-block">
              {l}
            </span>
          ))}
        </span>
        {/* the seal O */}
        <svg
          width={sealSize}
          height={sealSize}
          viewBox="0 0 36 36"
          fill="none"
          className="ml-[2px] translate-y-[-1px]"
          data-seal
          aria-hidden="true"
        >
          <circle className="seal-fill" cx="18" cy="18" r="15" fill="var(--color-accent)" opacity="0" />
          <g className="seal-spin">
            <circle
              cx="18"
              cy="18"
              r="15"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              data-seal-ring
            />
          </g>
          <path
            className="seal-check"
            d="M11 18.5 L16 23.5 L25.5 12.5"
            stroke="var(--color-accent-ink)"
            strokeWidth="3.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            data-seal-check
          />
        </svg>
      </span>
      <span className="logo-tag block">
        <span
          data-logo-tag
          className="block pt-[3px] text-[9px] font-bold tracking-[0.24em] text-muted uppercase"
        >
          Your Compliance Partner
        </span>
      </span>
    </div>
  );
}
