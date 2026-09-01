import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Linkedin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHead, Modal, cn } from "../components/ui";
import { QuoteMark } from "../components/illustrations";
import { TEAM, TESTIMONIALS, POSTS } from "../content/data";
import { gsap, useGSAP, drawIn, scrollToId, prefersReduced, EASE } from "../lib/gsap";

/* placeholder attributions — replace with real, consented testimonials */

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

/* ---------- hand-drawn blog covers, one family ---------- */
function PostArt({ kind, className }: { kind: string; className?: string }) {
  if (kind === "inc-20a")
    return (
      <svg viewBox="0 0 160 100" className={className} aria-hidden="true">
        <rect x="30" y="12" width="72" height="80" rx="6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M42 30 H88 M42 42 H88 M42 54 H74" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".55" fill="none" data-draw />
        <circle cx="112" cy="70" r="16" fill="none" stroke="var(--color-accent)" strokeWidth="2.2" data-draw />
        <path d="M105 70 l5 5 l10 -11" stroke="var(--color-accent)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" data-draw />
      </svg>
    );
  if (kind === "80iac")
    return (
      <svg viewBox="0 0 160 100" className={className} aria-hidden="true">
        <circle cx="80" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="2" data-draw />
        <path d="M68 36 H94 M68 45 H94 M73 36 c12 0 16 8 8 15 l-14 15" stroke="var(--color-accent)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" data-draw />
        <path d="M120 22 l6 6 l10 -12" stroke="var(--color-accent)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" data-draw />
      </svg>
    );
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden="true">
      <path d="M52 10 H108 V88 L101 82 L94 88 L87 82 L80 88 L73 82 L66 88 L59 82 L52 88 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" data-draw />
      <path d="M62 28 H98 M62 40 H98 M62 52 H86" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".55" fill="none" data-draw />
      <path d="M62 66 H98" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" fill="none" data-draw />
    </svg>
  );
}

/* ================= TEAM ================= */

export function Team() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced() || !root.current) return;
      gsap.from(root.current.querySelectorAll("[data-member]"), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.06,
        ease: EASE.ink,
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section id="team" ref={root} className="relative bg-paper py-24 md:py-40">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHead eyebrow="Our team" title="The people behind your compliance" />
          <div className="lg:pb-2">
            <p className="max-w-[380px] text-[14px] leading-relaxed text-muted">
              At Complianto Consulting, our experts are committed to guiding and empowering you on
              your startup journey.
            </p>
            <a href="#consultation" onClick={(e) => { e.preventDefault(); scrollToId("consultation"); }} className="tlink mt-3 inline-block text-[13.5px] font-bold text-accent-strong">
              More about us →
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <article key={m.name} data-member data-hovercard className="group overflow-hidden rounded-lg border border-line bg-paper">
              {/* «client photos» — initials stand in until supplied */}
              <div className="relative aspect-[4/5] overflow-hidden bg-accent-wash">
                <span className="absolute inset-0 flex items-center justify-center font-display text-6xl font-black text-accent-strong transition-transform duration-500 group-hover:scale-[1.06]" style={{ transitionTimingFunction: "cubic-bezier(.65,0,.35,1)" }}>
                  {initials(m.name)}
                </span>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on LinkedIn`}
                  className="absolute bottom-3 right-3 rounded-[3px] bg-paper p-2 text-accent-strong opacity-0 shadow-sm transition-all duration-300 hover:bg-accent hover:text-accent-ink focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Linkedin size={15} />
                </a>
              </div>
              <div className="p-5">
                <h3 className="font-display text-[16px] font-bold text-ink">{m.name}</h3>
                <span className="mt-1.5 block h-[2px] w-8 origin-left scale-x-0 bg-accent transition-transform duration-350 group-hover:scale-x-100" style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }} />
                <p className="mt-2 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-accent-strong">{m.role}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{m.line}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const [inView, setInView] = useState<boolean[]>(() => TESTIMONIALS.map((_, i) => i === 0));

  const plugins = useMemo(
    () =>
      prefersReduced()
        ? []
        : [Autoplay({ delay: 6000, stopOnMouseEnter: true, stopOnFocusIn: true, stopOnInteraction: false })],
    []
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, plugins);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setInView(emblaApi.scrollSnapList().map((_, i) => emblaApi.slidesInView().includes(i)));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  /* progress fill on the active dot */
  useEffect(() => {
    if (prefersReduced()) return;
    const fill = document.getElementById("dot-fill");
    if (fill) gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: "none", overwrite: true });
  }, [selected]);

  useGSAP(
    () => {
      if (prefersReduced() || !root.current) return;
      root.current.querySelectorAll("[data-quote-mark]").forEach((q) => drawIn(q as HTMLElement, { duration: 0.6 }));
    },
    { scope: root }
  );

  return (
    <section id="testimonials" ref={root} className="relative border-y border-line bg-elevated py-24 md:py-36">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <SectionHead eyebrow="Testimonials" title="What our clients say" />
          <div className="hidden gap-2 pb-1 md:flex">
            <button onClick={() => emblaApi?.scrollPrev()} aria-label="Previous testimonial" className="rounded-full border border-line bg-paper p-3 text-ink transition-all duration-300 hover:border-accent hover:text-accent-strong">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => emblaApi?.scrollNext()} aria-label="Next testimonial" className="rounded-full border border-line bg-paper p-3 text-ink transition-all duration-300 hover:border-accent hover:text-accent-strong">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.who} className="min-w-0 flex-[0_0_88%] pl-4 first:pl-0 sm:flex-[0_0_60%] lg:flex-[0_0_46%]">
                <figure
                  className={cn(
                    "flex h-full flex-col rounded-[16px] border border-line bg-paper p-7 transition-all duration-[450ms] md:p-8",
                    inView[i] ? "opacity-100" : "scale-[0.94] opacity-50"
                  )}
                  style={{ transitionTimingFunction: "cubic-bezier(.65,0,.35,1)" }}
                >
                  <div data-quote-mark>
                    <QuoteMark className="w-9" />
                  </div>
                  <blockquote className="mt-5 flex-1 font-display text-[18px] font-bold leading-snug text-ink md:text-[21px]">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-wash font-display text-[13px] font-black text-accent-strong">
                      {t.who[0]}
                    </span>
                    <span>
                      <span className="block text-[12.5px] font-bold text-ink">{t.who}</span>
                      <span className="block text-[11.5px] font-semibold text-muted">{t.where}</span>
                    </span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === selected}
              className={cn("h-1.5 overflow-hidden rounded-full transition-all duration-300", i === selected ? "w-9 bg-line" : "w-3 bg-line hover:bg-accent-soft")}
            >
              {i === selected && (
                <span
                  id="dot-fill"
                  className="block h-full w-full origin-left rounded-full bg-accent"
                  style={prefersReduced() ? undefined : { transform: "scaleX(0)" }}
                />
              )}
            </button>
          ))}
          <span className="ml-3 text-[11px] font-bold tracking-wider text-muted num">
            {String(selected + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ================= BLOG ================= */

export function Blog() {
  const root = useRef<HTMLElement>(null);
  const [post, setPost] = useState<(typeof POSTS)[number] | null>(null);

  useGSAP(
    () => {
      if (prefersReduced() || !root.current) return;
      gsap.from(root.current.querySelectorAll("[data-post]"), {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.08,
        ease: EASE.ink,
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
      root.current.querySelectorAll("[data-post-art]").forEach((a) => drawIn(a as HTMLElement, { duration: 0.8 }));
    },
    { scope: root }
  );

  return (
    <section id="blog" ref={root} className="relative bg-paper py-24 md:py-40">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHead eyebrow="Guides" title="From the Complianto blog" />
          <p className="max-w-[340px] text-[14px] leading-relaxed text-muted lg:pb-2">
            Plain-language notes on the filings founders actually face. No jargon, no fear-mongering.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {POSTS.map((p) => (
            <article key={p.id} data-post data-hovercard className="group flex flex-col overflow-hidden rounded-lg border border-line bg-paper">
              <div className="relative aspect-[16/10] overflow-hidden bg-accent-wash">
                <div data-post-art className="absolute inset-0 flex items-center justify-center text-accent-strong transition-transform duration-500 group-hover:scale-[1.05]" style={{ transitionTimingFunction: "cubic-bezier(.65,0,.35,1)" }}>
                  <PostArt kind={p.id} className="w-[62%]" />
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-accent-strong">
                  {p.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="title-sweep font-display text-[17px] font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-accent-strong">
                  {p.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-muted">{p.excerpt}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="num text-[11.5px] font-bold tracking-wide text-muted">{p.mins} min read</span>
                  <button onClick={() => setPost(p)} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-accent-strong">
                    Read more
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Modal open={post !== null} onClose={() => setPost(null)} label={post?.category ?? "Guide"}>
        {post && (
          <>
            <h3 className="font-display text-2xl font-black leading-tight text-ink">{post.title}</h3>
            <p className="num mt-2 text-[11.5px] font-bold tracking-wider text-muted">{post.mins} MIN READ · COMPLIANTO TEAM</p>
            <div className="mt-5 space-y-4">
              {post.body.map((para, i) => (
                <p key={i} className="text-[14px] leading-relaxed text-ink-80">
                  {para}
                </p>
              ))}
            </div>
            <p className="mt-6 border-t border-line pt-4 text-[11.5px] leading-relaxed text-muted">
              General guidance only — not legal or tax advice. Confirm specifics for your business with our team.
            </p>
          </>
        )}
      </Modal>
    </section>
  );
}
