import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Phone, ChevronDown, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "./ui";
import { SERVICES, CATEGORIES, site, type Category } from "../content/data";
import { gsap, useGSAP, ScrollTrigger, scrollToId, emit, EVT_FILTER, prefersReduced, EASE } from "../lib/gsap";

const NAV = [
  { label: "Journey", id: "journey" },
  { label: "Why us", id: "why" },
  { label: "Deadlines", id: "deadlines" },
  { label: "Blog", id: "blog" },
];

const MEGA_GROUPS: { title: string; cats: Category[] }[] = [
  { title: "Start a Business", cats: ["Start a Business"] },
  { title: "Licenses & IP", cats: ["Licenses", "Trademark & IP"] },
  { title: "Compliances & Tax", cats: ["Compliances", "Income Tax", "Labour"] },
  { title: "Growth & Digital", cats: ["Digital Marketing"] },
];

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const [mega, setMega] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [acc, setAcc] = useState<Category | null>("Start a Business");

  /* Condense + hide-on-scroll + progress bar — all ScrollTrigger-driven */
  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;

    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      toggleClass: { targets: header, className: "is-condensed" },
    });

    ScrollTrigger.create({
      start: "top -600",
      end: 99999,
      onUpdate: (self) => {
        setMega(false);
        gsap.to(header, {
          yPercent: self.direction === 1 ? -100 : 0,
          duration: 0.4,
          ease: EASE.glide,
          overwrite: true,
        });
      },
    });

    ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: 0.3,
      onUpdate: (self) => {
        if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
      },
    });
  });

  /* Mega menu open/close animation */
  useEffect(() => {
    const panel = megaRef.current;
    if (!panel) return;
    if (prefersReduced()) {
      gsap.set(panel, { autoAlpha: mega ? 1 : 0, pointerEvents: mega ? "auto" : "none" });
      return;
    }
    if (mega) {
      gsap.set(panel, { pointerEvents: "auto" });
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: -12, clipPath: "inset(0 0 100% 0)" },
        { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.45, ease: EASE.ink, overwrite: true }
      );
      gsap.fromTo(
        panel.querySelectorAll("[data-mega-col]"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: EASE.ink, delay: 0.08, overwrite: true }
      );
    } else {
      gsap.to(panel, {
        autoAlpha: 0,
        y: -8,
        clipPath: "inset(0 0 100% 0)",
        duration: 0.25,
        ease: EASE.glide,
        overwrite: true,
        onComplete: () => gsap.set(panel, { pointerEvents: "none" }),
      });
    }
  }, [mega]);

  /* Outside click + Escape */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (mega && headerRef.current && !headerRef.current.contains(e.target as Node)) setMega(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        setDrawer(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [mega]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMega(false);
    setDrawer(false);
    scrollToId(id);
  };

  const pickService = (cat: Category | "All") => {
    emit(EVT_FILTER, cat);
    setMega(false);
    setDrawer(false);
    scrollToId("services");
  };

  return (
    <>
      <header ref={headerRef} className="site-header">
        <div className="mx-auto flex h-full max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#hero" onClick={go("hero")} aria-label="Complianto — home" className="shrink-0">
            <Logo size="md" />
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <button
              className={cn(
                "flex items-center gap-1 rounded-[3px] px-3.5 py-2 text-[13.5px] font-semibold text-ink-80 transition-colors hover:text-accent-strong",
                mega && "text-accent-strong"
              )}
              aria-expanded={mega}
              aria-haspopup="true"
              onClick={() => setMega((v) => !v)}
            >
              Services
              <ChevronDown size={14} className={cn("transition-transform duration-300", mega && "rotate-180")} />
            </button>
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={go(n.id)}
                className="rounded-[3px] px-3.5 py-2 text-[13.5px] font-semibold text-ink-80 transition-colors hover:text-accent-strong"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 text-[13px] font-bold text-ink-80 transition-colors hover:text-accent-strong xl:flex"
            >
              <Phone size={15} className="text-accent-strong" />
              {site.phone}
            </a>
            <a href="#consultation" onClick={go("consultation")} className="btn btn-primary hidden !px-4 !py-2.5 !text-[13px] sm:inline-flex">
              Free consultation
            </a>
            <button
              className={cn("burger relative z-[95] flex flex-col items-center justify-center p-2 lg:hidden", drawer && "open")}
              aria-label={drawer ? "Close menu" : "Open menu"}
              aria-expanded={drawer}
              onClick={() => setDrawer((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div ref={barRef} className="header-progress" aria-hidden="true" />

        {/* Mega menu */}
        <div
          ref={megaRef}
          className="absolute left-0 right-0 top-full hidden border-b border-line bg-paper shadow-[0_24px_48px_rgba(10,10,10,0.08)] lg:block"
          style={{ visibility: "hidden", pointerEvents: "none" }}
          aria-hidden={!mega}
        >
          <div className="mx-auto grid max-w-[1240px] grid-cols-4 gap-8 px-8 py-8">
            {MEGA_GROUPS.map((g) => (
              <div key={g.title} data-mega-col>
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{g.title}</p>
                <ul>
                  {SERVICES.filter((s) => g.cats.includes(s.category)).map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => pickService(s.category)}
                        className="group flex w-full items-center gap-2.5 py-[7px] text-left text-[13.5px] font-semibold text-ink-80 transition-colors hover:text-accent-strong"
                      >
                        <s.icon size={15} className="shrink-0 text-accent-strong opacity-70 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-line bg-elevated">
            <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-3.5">
              <p className="text-[13px] font-semibold text-muted">Not sure where to start?</p>
              <button onClick={() => pickService("All")} className="tlink text-[13px] font-bold text-accent-strong">
                Browse all services →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer — portal keeps it clear of smoother transforms */}
      {createPortal(
        <div
          className={cn("fixed inset-0 z-[90] lg:hidden", !drawer && "pointer-events-none")}
          aria-hidden={!drawer}
        >
          <div
            className={cn("absolute inset-0 bg-ink/40 transition-opacity duration-300", drawer ? "opacity-100" : "opacity-0")}
            onClick={() => setDrawer(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-0 flex h-full w-[min(88vw,380px)] flex-col bg-paper shadow-2xl transition-transform duration-[450ms]",
              drawer ? "translate-x-0" : "translate-x-full"
            )}
            style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
            role="dialog"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <Logo size="sm" />
              <button onClick={() => setDrawer(false)} aria-label="Close menu" className="p-2 text-muted hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {CATEGORIES.map((cat) => {
                const open = acc === cat;
                const items = SERVICES.filter((s) => s.category === cat);
                return (
                  <div key={cat} className="border-b border-line">
                    <button
                      className="flex w-full items-center justify-between py-4 text-left font-display text-[15px] font-bold text-ink"
                      aria-expanded={open}
                      onClick={() => setAcc(open ? null : cat)}
                    >
                      {cat}
                      <ChevronDown size={16} className={cn("text-muted transition-transform duration-300", open && "rotate-180")} />
                    </button>
                    <div className={cn("grid transition-[grid-template-rows] duration-[350ms]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")} style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}>
                      <div className="overflow-hidden">
                        <ul className="pb-4">
                          {items.map((s) => (
                            <li key={s.id}>
                              <button
                                onClick={() => pickService(s.category)}
                                className="flex w-full items-center gap-2.5 py-2 text-left text-[13.5px] font-semibold text-muted transition-colors hover:text-accent-strong"
                              >
                                <s.icon size={14} className="text-accent-strong" aria-hidden="true" />
                                {s.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
              <ul className="py-4">
                {NAV.map((n) => (
                  <li key={n.id}>
                    <a href={`#${n.id}`} onClick={go(n.id)} className="block py-2.5 font-display text-[15px] font-bold text-ink">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line px-6 py-5">
              <a href="#consultation" onClick={go("consultation")} className="btn btn-primary w-full">
                Get free consultation
              </a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-3 block text-center text-[13px] font-bold text-accent-strong">
                {site.phone} · {site.hours}
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
