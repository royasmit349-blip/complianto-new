import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Footer, FloatingActions } from "./components/Footer";
import { ComplianceLine } from "./components/ComplianceLine";
import { Logo } from "./components/Logo";
import { Hero } from "./sections/Hero";
import { Journey } from "./sections/Journey";
import { Services, WhyAndStats } from "./sections/ServicesWhy";
import { Deadlines } from "./sections/Deadlines";
import { Team, Testimonials, Blog } from "./sections/People";
import { Consultation } from "./sections/Consultation";
import { gsap, useGSAP, ScrollTrigger, ScrollSmoother, MQ, EASE, prefersReduced } from "./lib/gsap";

/* ---------- Preloader: logo intro, hard-capped at 1.6s, first visit only ---------- */
function Preloader({ onDone }: { onDone: () => void }) {
  const overlay = useRef<HTMLDivElement>(null);
  const logoWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {
        /* private mode */
      }
      const el = overlay.current;
      if (!el) {
        onDone();
        return;
      }
      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.7,
        ease: EASE.ink,
        onComplete: onDone,
      });
    };

    const cap = window.setTimeout(finish, 1600); // hard cap — never cost LCP more

    const scope = logoWrap.current;
    if (scope) {
      const letters = scope.querySelectorAll("[data-logo-letter]");
      const hi = scope.querySelector(".logo-highlight");
      const ring = scope.querySelector("[data-seal-ring]");
      const check = scope.querySelector("[data-seal-check]");
      const seal = scope.querySelector("[data-seal]");
      const tag = scope.querySelector("[data-logo-tag]");
      const tl = gsap.timeline({ defaults: { ease: EASE.ink } });
      tl.from(letters, { y: 14, opacity: 0, stagger: 0.035, duration: 0.5 }, 0)
        .from(hi, { scaleX: 0, duration: 0.55, ease: EASE.glide }, 0.28)
        .from(ring, { drawSVG: "0%", rotate: -90, transformOrigin: "center", duration: 0.6 }, 0.45)
        .from(check, { drawSVG: "0%", duration: 0.4, ease: "power2.out" }, 0.8);
      if (seal) tl.fromTo(seal, { scale: 1 }, { scale: 1.12, duration: 0.22, yoyo: true, repeat: 1, ease: EASE.seal }, 0.95);
      if (tag) tl.from(tag, { opacity: 0, y: 6, letterSpacing: "0.42em", duration: 0.5 }, 1.1);
    }

    /* exit as soon as fonts + load resolve (plus a beat for the stamp) */
    Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => (document.readyState === "complete" ? r(0) : window.addEventListener("load", () => r(0), { once: true }))),
    ]).then(() => window.setTimeout(finish, 850));

    return () => window.clearTimeout(cap);
  }, [onDone]);

  return (
    <div ref={overlay} className="fixed inset-0 z-[110] flex items-center justify-center bg-paper" style={{ clipPath: "inset(0 0 0% 0)" }}>
      <div ref={logoWrap}>
        <Logo size="md" intro />
      </div>
    </div>
  );
}

export default function App() {
  const [skipped] = useState(() => {
    try {
      return sessionStorage.getItem("intro-seen") === "1" || prefersReduced();
    } catch {
      return false;
    }
  });
  const [introDone, setIntroDone] = useState(skipped);

  /* ScrollSmoother — desktop, motion allowed only. Fixed elements live OUTSIDE. */
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.full, () => {
      let smoother: ScrollSmoother | null = null;
      try {
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.2,
          effects: true,
          normalizeScroll: true,
          ignoreMobileResize: true,
          smoothTouch: false,
        });
      } catch {
        smoother = null;
      }
      return () => {
        smoother?.kill();
      };
    });
    return () => mm.revert();
  });

  /* Refresh triggers once fonts/layout settle */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready
      ?.then(() => window.setTimeout(refresh, 60))
      .catch(() => undefined);
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 1800); // late safety net
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className="relative bg-paper font-body text-ink">
      {!skipped && <Preloader onDone={() => setIntroDone(true)} />}

      <Header />

      <div id="smooth-wrapper">
        <div id="smooth-content" className="relative">
          <ComplianceLine />
          <main>
            <Hero ready={introDone} />
            <Journey />
            <Services />
            <WhyAndStats />
            <Deadlines />
            <Team />
            <Testimonials />
            <Blog />
            <Consultation />
          </main>
          <Footer />
        </div>
      </div>

      <FloatingActions />
      <div className="grain-layer" aria-hidden="true" />
    </div>
  );
}
