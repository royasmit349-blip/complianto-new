import { useEffect, useRef, useState } from "react";
import { CalendarGrid } from "../components/illustrations";
import { SectionHead, cn } from "../components/ui";
import { DEADLINES, DEADLINE_DISCLAIMER, ENTITIES, type Entity } from "../content/data";
import { gsap, useGSAP, drawIn, emit, EVT_PREFILL, scrollToId, prefersReduced, MQ, EASE } from "../lib/gsap";

export function Deadlines() {
  const root = useRef<HTMLElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const [entity, setEntity] = useState<Entity>("Private Limited");
  const firstRender = useRef(true);

  const rows = DEADLINES[entity];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* FULL — the dark section rises over the page as you arrive */
      mm.add(MQ.full, () => {
        gsap.fromTo(
          wipeRef.current,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 92%", end: "top 42%", scrub: 1 },
          }
        );
      });

      /* Rows arrive + check themselves off */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!rowsRef.current) return;
        gsap.from(rowsRef.current.querySelectorAll("[data-row]"), {
          opacity: 0,
          x: -24,
          duration: 0.55,
          stagger: 0.09,
          ease: EASE.ink,
          scrollTrigger: { trigger: rowsRef.current, start: "top 80%", once: true },
        });
        const checks = rowsRef.current.querySelectorAll("[data-row] [data-draw]");
        gsap.from(checks, {
          drawSVG: "0%",
          duration: 0.35,
          stagger: 0.09,
          delay: 0.2,
          ease: EASE.ink,
          scrollTrigger: { trigger: rowsRef.current, start: "top 80%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  /* entity switch: out, swap, in */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const els = rowsRef.current?.querySelectorAll("[data-row]");
    if (!els || prefersReduced()) return;
    gsap.fromTo(
      els,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: EASE.ink, overwrite: true }
    );
    const checks = rowsRef.current?.querySelectorAll("[data-row] [data-draw]");
    if (checks?.length)
      gsap.fromTo(checks, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.35, stagger: 0.05, delay: 0.12, overwrite: true });
  }, [entity]);

  /* calendar art draws once on reveal */
  useEffect(() => {
    const cal = root.current?.querySelector("[data-cal]");
    if (cal) drawIn(cal as HTMLElement, { duration: 0.9, stagger: 0.06 });
  }, []);

  const remind = () => {
    emit(EVT_PREFILL, {
      service: entity === "Proprietorship" ? "GST Registration & Returns" : "ROC Compliances",
      query: `Please send me deadline reminders for my ${entity}.`,
    });
    scrollToId("consultation");
  };

  return (
    <section id="deadlines" ref={root} className="relative bg-paper">
      <div ref={wipeRef} className="wipe-clip bg-ink text-paper">
        <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 md:py-36">
          <div>
            <SectionHead dark eyebrow="Deadline tracker" title="Never miss a compliance deadline." />
            <p className="mt-5 max-w-[480px] text-[14.5px] leading-relaxed text-paper/70">
              We track every ROC, GST and income tax due date for you — and remind you before it
              matters, not after.
            </p>

            <div className="mt-9 flex flex-wrap gap-2" role="group" aria-label="Choose entity type">
              {ENTITIES.map((e) => (
                <button
                  key={e}
                  onClick={() => setEntity(e)}
                  aria-pressed={entity === e}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[12.5px] font-bold transition-all duration-300",
                    entity === e
                      ? "border-paper bg-paper text-ink"
                      : "border-line-dark text-paper/65 hover:border-accent-soft hover:text-accent-soft"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>

            <div ref={rowsRef} className="mt-8 border-t border-line-dark">
              {rows.map((r) => (
                <div key={`${entity}-${r.form}`} data-row className="grid grid-cols-[92px_1fr] items-baseline gap-x-4 gap-y-1 border-b border-line-dark py-4 sm:grid-cols-[110px_1fr_auto]">
                  <span className="font-display text-[14px] font-black tracking-wide text-paper">{r.form}</span>
                  <span className="text-[13px] font-medium text-paper/60">{r.what}</span>
                  <span className="col-span-2 flex items-center gap-3 sm:col-span-1 sm:justify-self-end">
                    <span className="text-[12px] font-bold text-accent-soft">{r.due}</span>
                    <span className="flex items-center gap-1.5 rounded-full border border-success/40 px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-success-soft">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 12.5 L9.5 18 L20 6.5" stroke="var(--color-success-soft)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" data-draw />
                      </svg>
                      On track
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              Showing {rows.length} upcoming deadlines for {entity}.
            </p>

            <p className="mt-6 text-[11.5px] leading-relaxed text-paper/40">{DEADLINE_DISCLAIMER}</p>
          </div>

          <div className="flex flex-col items-start justify-center gap-8">
            <div data-cal data-speed="0.92" className="w-[min(80vw,340px)] text-paper">
              <CalendarGrid className="w-full" />
            </div>
            <div>
              <button onClick={remind} className="btn btn-primary">
                Get deadline reminders
              </button>
              <div className="mt-6 flex flex-wrap gap-2">
                {["ROC", "GST", "TDS", "PF / ESI", "ITR"].map((t) => (
                  <span key={t} className="rounded-full border border-line-dark px-3 py-1.5 text-[11px] font-bold text-paper/60">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
