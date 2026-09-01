import { useRef } from "react";
import { CertificateCard } from "../components/illustrations";
import { scrollToId, gsap, useGSAP, splitLines, MQ, EASE, DUR } from "../lib/gsap";

const MARQUEE = [
  "Incorporation",
  "GST returns",
  "ROC filings",
  "Income tax",
  "Trademarks",
  "ISO 9001",
  "FSSAI",
  "Startup India",
  "PF & ESI",
  "12A / 80G",
  "Annual compliance",
  "Bookkeeping",
];

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cueInner = useRef<HTMLSpanElement>(null);
  const cueWrap = useRef<HTMLDivElement>(null);
  const marqueeRow = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ready || !root.current) return;
      const mm = gsap.matchMedia();

      /* FULL — desktop entrance, parallax depth, marquee, cue */
      mm.add(MQ.full, () => {
        const q = gsap.utils.selector(root.current!);

        const tl = gsap.timeline({ defaults: { ease: EASE.ink } });
        tl.from(q(".grid-bg"), { opacity: 0, duration: 0.8 }, 0)
          .from(q("[data-hero-eyebrow]"), { opacity: 0, y: 12, letterSpacing: "0.45em", duration: 0.5 }, 0.1)
          .add(() => {
            splitLines(h1.current, { duration: 0.9, stagger: 0.09 });
          }, 0.2)
          .from(q("[data-hero-sub]"), { opacity: 0, y: 16, duration: 0.7 }, 0.55)
          .from(q("[data-hero-cta]"), { opacity: 0, y: 14, scale: 0.96, stagger: 0.08, duration: 0.5 }, 0.7)
          .from(cardRef.current, { opacity: 0, y: 40, rotate: -3, duration: 1.0 }, 0.85)
          .from(q("[data-hero-trust]"), { opacity: 0, y: 10, duration: 0.5 }, 1.1);

        // card internals draw after the card lands
        const paths = cardRef.current?.querySelectorAll("[data-draw]");
        if (paths?.length) {
          gsap.fromTo(
            paths,
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 0.8, stagger: 0.09, ease: EASE.ink, delay: 1.05 }
          );
        }

        tl.from(cueWrap.current, { opacity: 0, duration: 0.4 }, 1.25);

        /* floating status tags */
        q("[data-float]").forEach((el, i) => {
          gsap.to(el, { y: i % 2 ? 7 : -7, duration: 2.6 + i * 0.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
        });

        /* scroll cue loop */
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.25 })
          .fromTo(cueInner.current, { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 0.7, ease: "power2.inOut" })
          .to(cueInner.current, { scaleY: 0, transformOrigin: "bottom center", duration: 0.7, ease: "power2.inOut" });
      });

      /* LITE — mobile: reveals only */
      mm.add(MQ.lite, () => {
        const q = gsap.utils.selector(root.current!);
        gsap.from(q("[data-hero-eyebrow], [data-hero-sub], [data-hero-cta], [data-hero-trust]"), {
          opacity: 0,
          y: 16,
          duration: DUR.base,
          ease: EASE.ink,
          stagger: 0.08,
          delay: 0.1,
        });
        splitLines(h1.current, { duration: 0.7, stagger: 0.07 });
        gsap.from(cardRef.current, { opacity: 0, y: 28, duration: 0.7, ease: EASE.ink, delay: 0.3 });
      });

      /* Hero scroll-out + cue fade — shared by full & lite */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(q2(".hero-content"), {
          y: -80,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
        });
        gsap.to(cueWrap.current, {
          opacity: 0,
          scrollTrigger: { trigger: root.current, start: "top top", end: "400 top", scrub: true },
        });
        /* marquee */
        if (marqueeRow.current) {
          const row = marqueeRow.current;
          const tween = gsap.to(row, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
          row.closest("[data-marquee]")?.addEventListener("mouseenter", () => tween.pause());
          row.closest("[data-marquee]")?.addEventListener("mouseleave", () => tween.play());
        }
      });

      function q2(sel: string) {
        return root.current!.querySelectorAll(sel);
      }
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section id="hero" ref={root} className="hero relative flex min-h-svh flex-col justify-center overflow-hidden bg-paper pb-28 pt-32 md:pt-36">
      {/* ambient planes */}
      <div className="grid-bg absolute inset-0" data-speed="0.85" aria-hidden="true" />
      <div className="blob absolute -top-32 right-[-10%] h-[560px] w-[560px]" data-lag="0.4" aria-hidden="true" />
      <div className="blob absolute bottom-[-14%] left-[-8%] h-[420px] w-[420px] opacity-70" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[58%_42%]">
        <div className="hero-content">
          <p data-hero-eyebrow className="eyebrow">
            Your Compliance Partner
          </p>
          <h1
            ref={h1}
            className="mt-5 font-display text-[38px] font-black leading-[1.07] tracking-[-0.015em] text-ink sm:text-[50px] lg:text-[56px] xl:text-[62px]"
          >
            Keeping you <span className="text-accent-strong">compliant,</span> so you can focus on your business.
          </h1>
          <p data-hero-sub className="mt-6 max-w-[540px] text-[15px] leading-relaxed text-muted md:text-base">
            From incorporation to GST, ROC filings and beyond — Complianto handles the paperwork
            while you build. Over <strong className="font-bold text-ink">20,000 businesses</strong> have
            trusted us to keep them compliant.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              data-hero-cta
              href="#consultation"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("consultation");
              }}
              className="btn btn-primary"
            >
              Get free consultation
            </a>
            <a
              data-hero-cta
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("services");
              }}
              className="btn btn-ghost"
            >
              Explore services
            </a>
          </div>
          <p data-hero-trust className="mt-10 flex items-center gap-2.5 text-[12.5px] font-bold tracking-wide text-muted">
            <svg width="16" height="16" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <circle cx="18" cy="18" r="15" stroke="var(--color-accent)" strokeWidth="3.4" />
              <path d="M11 18.5 L16 23.5 L25.5 12.5" stroke="var(--color-accent)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Trusted by 20,000+ businesses across India
          </p>
        </div>

        <div className="relative" data-speed="1.12">
          <div ref={cardRef} className="relative mx-auto w-[min(86vw,400px)] rounded-[16px] border border-line bg-elevated p-7 shadow-[0_24px_60px_rgba(10,10,10,0.07)] md:p-9">
            <CertificateCard className="w-full text-ink" />
            <span data-float className="tag absolute -left-5 top-10 shadow-sm">
              <i className="h-1.5 w-1.5 rounded-full bg-accent" /> ROC · MCA filed
            </span>
            <span data-float className="tag absolute -right-4 bottom-16 shadow-sm">
              <i className="h-1.5 w-1.5 rounded-full bg-success" /> GST · ready
            </span>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div ref={cueWrap} className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2.5 md:flex">
        <span className="relative block h-12 w-[2px] overflow-hidden bg-line">
          <span ref={cueInner} className="absolute inset-x-0 top-0 h-full bg-accent" />
        </span>
        <span className="text-[9.5px] font-extrabold uppercase tracking-[0.28em] text-muted">Scroll</span>
      </div>

      {/* coverage marquee */}
      <div data-marquee className="absolute inset-x-0 bottom-0 z-10 border-y border-line bg-elevated py-3.5" aria-label="Compliance coverage">
        <div className="mask-fade-x overflow-hidden">
          <div ref={marqueeRow} className="flex w-max items-center gap-10 pr-10">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-10" aria-hidden={dup === 1}>
                {MARQUEE.map((m) => (
                  <span key={`${dup}-${m}`} className="flex items-center gap-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-muted">
                    <svg width="13" height="13" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                      <circle cx="18" cy="18" r="14" stroke="var(--color-accent)" strokeWidth="4" />
                      <path d="M11.5 18.5 L16 23 L25 13" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {m}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
