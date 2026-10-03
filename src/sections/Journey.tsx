import { useRef } from "react";
import { SectionHead } from "../components/ui";
import { CertificateCard, LedgerStack, GrowthChart } from "../components/illustrations";
import { ACTS } from "../content/data";
import { gsap, useGSAP, drawIn, MQ, EASE } from "../lib/gsap";

const ART = {
  certificate: CertificateCard,
  ledger: LedgerStack,
  growth: GrowthChart,
} as const;

export function Journey() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* FULL — pinned three-act scroll piece */
      mm.add(MQ.full, () => {
        const stage = stageRef.current;
        if (!stage) return;
        const panels = gsap.utils.toArray<HTMLElement>(".act-panel");
        if (panels.length < 3) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=3000",
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = self.progress < 0.3 ? 0 : self.progress < 0.63 ? 1 : 2;
              railRef.current?.querySelectorAll("[data-rail]").forEach((r, i) => {
                r.setAttribute("data-active", String(i === idx));
              });
            },
          },
        });

        const actIn = (i: number, t: number) => {
          const p = panels[i];
          const head = p.querySelector(".act-head");
          const num = p.querySelector(".act-num");
          const copy = p.querySelector(".act-copy");
          const nodes = p.querySelectorAll(".act-nodes li");
          const art = p.querySelector(".act-art");
          tl.fromTo(p, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "none" }, t);
          tl.fromTo(num, { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: 0.4, ease: "none" }, t + 0.04);
          tl.fromTo(head, { yPercent: 34, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "none" }, t + 0.02);
          tl.fromTo(copy, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "none" }, t + 0.12);
          tl.fromTo(nodes, { opacity: 0, y: 12, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.03, ease: "none" }, t + 0.18);
          tl.fromTo(art, { opacity: 0, x: 44, rotate: 2 }, { opacity: 1, x: 0, rotate: 0, duration: 0.5, ease: "none" }, t + 0.1);
          if (art) {
            const paths = art.querySelectorAll("[data-draw]");
            if (paths.length)
              tl.fromTo(paths, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.55, stagger: 0.04, ease: "none" }, t + 0.16);
            /* counter-scroll drift — art and text never move as one rigid block */
            tl.fromTo(art, { y: 34 }, { y: -34, duration: 2.7, ease: "none" }, t);
          }
        };

        const actOut = (i: number, t: number) => {
          tl.to(panels[i], { autoAlpha: 0, y: -64, duration: 0.5, ease: "none" }, t);
        };

        /* act 1 starts fully visible (its "in" completes before time 0) */
        actIn(0, -0.6);
        actOut(0, 2.8);
        actIn(1, 3.3);
        actOut(1, 6.1);
        actIn(2, 6.6); /* act 3 holds — hands off to the next section */
        tl.to({}, { duration: 0.4 }, 9.6);
      });

      /* LITE — mobile: plain stacked acts, no pin, no scrub */
      mm.add(MQ.lite, () => {
        root.current?.querySelectorAll<HTMLElement>("[data-mobile-act]").forEach((act) => {
          gsap.from(act, {
            opacity: 0,
            y: 24,
            duration: 0.6,
            ease: EASE.ink,
            scrollTrigger: { trigger: act, start: "top 82%", once: true },
          });
          const nodes = act.querySelectorAll(".act-nodes li");
          gsap.from(nodes, {
            opacity: 0,
            y: 10,
            duration: 0.35,
            stagger: 0.04,
            ease: EASE.ink,
            scrollTrigger: { trigger: act, start: "top 70%", once: true },
          });
        });
        root.current?.querySelectorAll<HTMLElement>(".mobile-art").forEach((art) => {
          drawIn(art, { duration: 0.9 });
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="journey" ref={root} className="journey relative bg-paper">
      <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-6 px-5 pb-14 pt-24 sm:px-8 md:flex-row md:items-end md:pt-40">
        <SectionHead eyebrow="The Compliance Journey" title="One continuous line from idea to scale." />
        <p className="max-w-[360px] text-[14px] leading-relaxed text-muted md:pb-2">
          Follow the line. Three acts — start, manage, scale — each one handled end-to-end so the
          paperwork never lands on your desk.
        </p>
      </div>

      {/* ---------- Desktop: pinned stage ---------- */}
      <div ref={stageRef} className="journey-stage relative hidden h-svh overflow-hidden md:block">
        <div className="mx-auto grid h-full max-w-[1240px] grid-cols-[120px_1fr] px-5 sm:px-8">
          {/* act progress rail */}
          <div ref={railRef} className="flex flex-col justify-center gap-7 border-r border-line pr-6">
            {ACTS.map((a, i) => (
              <div key={a.num} data-rail data-active={String(i === 0)} className="rail-item">
                <span className="rail-bar" />
                <span>
                  {a.num} {a.label}
                </span>
              </div>
            ))}
          </div>

          <div className="journey-pin relative">
            {ACTS.map((act) => {
              const Art = ART[act.art];
              return (
                <div key={act.num} className="act-panel grid items-center gap-10 px-8 lg:grid-cols-2 lg:gap-6">
                  <div>
                    <p className="act-num font-display text-[104px] font-black leading-[0.85] text-accent-wash lg:text-[128px]">
                      {act.num}
                    </p>
                    <h3 className="act-head -mt-10 font-display text-4xl font-black tracking-tight text-ink lg:-mt-14 lg:text-[46px]">
                      {act.heading}
                    </h3>
                    <p className="act-copy mt-5 max-w-[460px] text-[14.5px] leading-relaxed text-muted">{act.copy}</p>
                    <ul className="act-nodes mt-7 flex flex-wrap gap-2">
                      {act.nodes.map((n) => (
                        <li key={n} className="tag">
                          <i className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="act-art justify-self-center text-ink lg:w-[min(30vw,380px)]">
                    <Art className="w-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Mobile: stacked acts, static rail ---------- */}
      <div className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8 md:hidden">
        {ACTS.map((act) => {
          const Art = ART[act.art];
          return (
            <article key={act.num} data-mobile-act className="relative border-l-2 border-line pb-16 pl-6 last:pb-0">
              <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-accent bg-paper" aria-hidden="true" />
              <p className="font-display text-[64px] font-black leading-[0.85] text-accent-wash">{act.num}</p>
              <h3 className="-mt-6 font-display text-3xl font-black tracking-tight text-ink">{act.heading}</h3>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">{act.copy}</p>
              <ul className="act-nodes mt-5 flex flex-wrap gap-2">
                {act.nodes.map((n) => (
                  <li key={n} className="tag">
                    <i className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    {n}
                  </li>
                ))}
              </ul>
              <div className="mobile-art mt-8 w-[min(70vw,300px)] text-ink">
                <Art className="w-full" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
