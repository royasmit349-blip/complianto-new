import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SectionHead, AnimatedIcon, cn } from "../components/ui";
import { SERVICES, PILLARS, STATS, CATEGORIES, site, type Category } from "../content/data";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  countUp,
  drawIn,
  emit,
  listen,
  EVT_FILTER,
  EVT_PREFILL,
  scrollToId,
  prefersReduced,
  EASE,
} from "../lib/gsap";

type Filter = Category | "All";

/* ================= SERVICES ================= */

export function Services() {
  const root = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [cat, setCat] = useState<Filter>("All");
  const firstRender = useRef(true);

  const items = cat === "All" ? SERVICES : SERVICES.filter((s) => s.category === cat);

  /* Filter changes from the mega menu / footer */
  useEffect(
    () =>
      listen(EVT_FILTER, (detail) => {
        const next = detail as Filter;
        setCat(CATEGORIES.includes(next as Category) ? (next as Filter) : "All");
      }),
    []
  );

  /* Initial batch reveal — one staggered tween per entering group */
  useGSAP(() => {
    if (prefersReduced() || !root.current) return;
    const cards = root.current.querySelectorAll(".service-card");
    ScrollTrigger.batch(cards, {
      start: "top 86%",
      once: true,
      onEnter: (batch) =>
        gsap.from(batch, {
          opacity: 0,
          y: 28,
          duration: 0.6,
          ease: EASE.ink,
          stagger: { each: 0.07, from: "start" },
          overwrite: true,
        }),
    });
  });

  /* FLIP-style transition when the filter changes */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const cards = gridRef.current?.querySelectorAll(".service-card");
    if (!cards || prefersReduced()) return;
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.96, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.04, ease: EASE.ink, overwrite: true }
    );
  }, [cat]);

  const learnMore = (title: string) => {
    emit(EVT_PREFILL, { service: title });
    scrollToId("consultation");
  };

  return (
    <section id="services" ref={root} className="relative bg-elevated py-24 md:py-40">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead eyebrow="What we do" title="Everything you need to stay compliant." />
          <p className="max-w-[340px] text-[14px] leading-relaxed text-muted lg:pb-2">
            Eleven service lines, one accountable team. Pick a starting point — we'll map the rest.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5" role="group" aria-label="Filter services by category">
          {(["All", ...CATEGORIES] as Filter[]).map((c) => (
            <button
              key={c}
              className={cn("chip", cat === c && "is-active")}
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {cat === "All" ? `Showing all ${items.length} services.` : `Showing ${items.length} services in ${cat}.`}
        </p>

        <div ref={gridRef} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((s) => (
            <article
              key={s.id}
              data-hovercard
              tabIndex={0}
              className="service-card card group flex flex-col p-6"
              aria-label={s.title}
            >
              <AnimatedIcon Icon={s.icon} className="text-accent" />
              <h3 className="title-sweep mt-5 font-display text-[17px] font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-accent-strong">
                {s.title}
              </h3>
              <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-muted">{s.blurb}</p>
              <button
                onClick={() => learnMore(s.title)}
                className="mt-5 inline-flex items-center gap-1.5 self-start text-[12.5px] font-bold text-accent-strong"
              >
                Learn more
                <ArrowRight size={14} className="transition-transform duration-250 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= WHY COMPLIANTO + STATS ================= */

export function WhyAndStats() {
  const whyRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const bigRef = useRef<HTMLSpanElement>(null);
  const plusRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const s2Ref = useRef<HTMLSpanElement>(null);
  const s3Ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!whyRef.current) return;
      if (!prefersReduced()) {
        const pillars = whyRef.current.querySelectorAll(".pillar");
        gsap.from(pillars, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: EASE.ink,
          stagger: { each: 0.08, grid: [2, 3], from: "start" },
          scrollTrigger: { trigger: pillars[0], start: "top 84%", once: true },
        });
        whyRef.current.querySelectorAll(".pillar-tick").forEach((tick) => drawIn(tick as HTMLElement, { duration: 0.5 }));
      }

      /* count-ups — zero layout shift, Indian digit grouping */
      if (STATS.clientsServed) countUp(bigRef.current, STATS.clientsServed, () => {
        if (plusRef.current && !prefersReduced()) gsap.from(plusRef.current, { opacity: 0, duration: 0.4 });
        if (ruleRef.current && !prefersReduced())
          gsap.fromTo(ruleRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: EASE.ink, transformOrigin: "left center" });
      });
      if (STATS.serviceLines) countUp(s2Ref.current, STATS.serviceLines);
      if (STATS.supportDays) countUp(s3Ref.current, STATS.supportDays);

    },
    { scope: whyRef }
  );

  return (
    <>
      <section id="why" ref={whyRef} className="relative bg-paper py-24 md:py-40">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHead eyebrow="Why Complianto" title="Why founders choose Complianto" />
            <p className="max-w-[340px] text-[14px] leading-relaxed text-muted lg:pb-2">
              Six commitments we make to every business — from a first-time founder to a
              multi-entity group.
            </p>
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div key={p.title} className="pillar group">
                <svg viewBox="0 0 40 14" className="pillar-tick h-3.5 w-10 text-ink" aria-hidden="true">
                  <path d="M1 7 H30" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" fill="none" data-draw />
                  <path d="M25 2 L31 7 L25 12" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" data-draw />
                </svg>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="num font-display text-[13px] font-black text-accent-strong">0{i + 1}</span>
                  <h3 className="font-display text-lg font-bold text-ink">{p.title}</h3>
                </div>
                <p className="mt-2 max-w-[320px] text-[13.5px] leading-relaxed text-muted">{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" ref={statsRef} className="relative border-y border-line bg-elevated">
        <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.15fr_1fr] md:py-28">
          <div>
            <p className="eyebrow">The record</p>
            <p className="mt-6 flex items-start font-display font-black leading-none text-ink">
              <span
                ref={bigRef}
                className="num inline-block text-[68px] tracking-tight sm:text-[92px] lg:text-[110px]"
                style={{ minWidth: `${(STATS.clientsServed ?? 0).toLocaleString("en-IN").length}ch` }}
              >
                0
              </span>
              <span ref={plusRef} className="mt-2 text-[44px] text-accent sm:mt-4 sm:text-[60px] lg:text-[72px]">
                +
              </span>
            </p>
            <span
              ref={ruleRef}
              className="mt-5 block h-[3px] w-24 bg-accent"
              style={{ transform: prefersReduced() ? undefined : "scaleX(0)", transformOrigin: "left center" }}
            />
            <p className="mt-5 font-display text-xl font-bold text-ink">clients served</p>
            <p className="mt-1.5 max-w-[380px] text-[13.5px] leading-relaxed text-muted">
              The only number we publish is the one we can stand behind — and it keeps growing,
              one renewal at a time.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
            {STATS.serviceLines !== null && (
              <div className="border-t-2 border-ink pt-5">
                <p className="num font-display text-5xl font-black text-ink">
                  <span ref={s2Ref}>0</span>
                </p>
                <p className="mt-2 font-display text-[15px] font-bold text-ink">service lines</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">under one roof — start, manage and scale.</p>
              </div>
            )}
            {STATS.supportDays !== null && (
              <div className="border-t-2 border-ink pt-5">
                <p className="num font-display text-5xl font-black text-ink">
                  <span ref={s3Ref}>0</span>
                  <span className="ml-1 text-2xl font-bold text-muted">days</span>
                </p>
                <p className="mt-2 font-display text-[15px] font-bold text-ink">a week on call</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{site.hours} — by phone and WhatsApp.</p>
              </div>
            )}
            <p className="text-[12px] leading-relaxed text-muted sm:col-span-2">
              Years in practice, team size and registration counts are shared on request —
              we only publish figures we can verify.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
