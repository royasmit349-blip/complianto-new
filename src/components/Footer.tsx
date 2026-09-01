import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, Clock, ArrowUp, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { Modal, cn } from "./ui";
import { SERVICES, site } from "../content/data";
import { gsap, ScrollTrigger, scrollToId, emit, EVT_FILTER, prefersReduced, EASE, useGSAP } from "../lib/gsap";

export function Footer() {
  const [legal, setLegal] = useState<null | "privacy" | "terms">(null);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };
  const pick = (cat: string) => {
    emit(EVT_FILTER, cat);
    scrollToId("services");
  };
  const top = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
  };

  return (
    <footer className="relative border-t border-line bg-paper">
      <div className="mx-auto max-w-[1240px] px-5 pb-28 pt-16 sm:px-8 md:pb-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <Logo size="md" />
            <p className="mt-5 max-w-[300px] text-[13.5px] leading-relaxed text-muted">
              Complianto Consulting keeps Indian businesses on the right side of every deadline —
              incorporation, GST, ROC filings, tax and beyond.
            </p>
            <ul className="mt-6 space-y-2.5 text-[13px] font-semibold text-ink-80">
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 transition-colors hover:text-accent-strong">
                  <Phone size={14} className="text-accent-strong" /> {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 transition-colors hover:text-accent-strong">
                  <Mail size={14} className="text-accent-strong" /> {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={14} className="text-accent-strong" /> {site.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={14} className="text-accent-strong" /> {site.hours}
              </li>
            </ul>
          </div>

          <nav aria-label="Services">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">Services</p>
            <ul className="mt-4 space-y-2">
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <button onClick={() => pick(s.category)} className="tlink text-left text-[13.5px] font-semibold text-ink-80 hover:text-accent-strong">
                    {s.title}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => pick("All")} className="tlink text-[13.5px] font-bold text-accent-strong">
                  All services →
                </button>
              </li>
            </ul>
          </nav>

          <nav aria-label="Explore">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">Explore</p>
            <ul className="mt-4 space-y-2">
              {[
                ["The journey", "journey"],
                ["Why Complianto", "why"],
                ["Deadline tracker", "deadlines"],
                ["Our team", "team"],
                ["Testimonials", "testimonials"],
                ["Blog", "blog"],
                ["Free consultation", "consultation"],
              ].map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={go(id)} className="tlink text-[13.5px] font-semibold text-ink-80 hover:text-accent-strong">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">Talk to us</p>
            <p className="mt-4 font-display text-xl font-black leading-snug text-ink">
              One conversation can untangle a year of paperwork.
            </p>
            <a href="#consultation" onClick={go("consultation")} className="btn btn-ghost mt-5 !py-2.5 text-[13px]">
              Book a free consultation
            </a>
            <p className="mt-6 text-[12px] leading-relaxed text-muted">
              Government fees are always billed at actuals. No hidden charges, ever.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-[12px] font-semibold text-muted">
            © 2026 Complianto Consulting · Noida, India
          </p>
          <div className="flex items-center gap-5">
            <button onClick={() => setLegal("privacy")} className="tlink text-[12px] font-semibold text-muted hover:text-ink">
              Privacy Policy
            </button>
            <button onClick={() => setLegal("terms")} className="tlink text-[12px] font-semibold text-muted hover:text-ink">
              Terms of Service
            </button>
            <button onClick={top} className="group flex items-center gap-1.5 text-[12px] font-bold text-accent-strong" aria-label="Back to top">
              Back to top
              <ArrowUp size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      <Modal open={legal !== null} onClose={() => setLegal(null)} label={legal === "terms" ? "Terms of Service" : "Privacy Policy"}>
        <h3 className="font-display text-xl font-black text-ink">
          {legal === "terms" ? "Terms of Service" : "Privacy Policy"}
        </h3>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
          «Draft document — final text to be supplied by the client before launch.»
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[13.5px] leading-relaxed text-muted">
          <li>Engagement scope, deliverables and timelines are confirmed in writing for every assignment.</li>
          <li>Government fees and statutory dues are billed at actuals, with receipts shared.</li>
          <li>Client information is held under confidentiality and never shared without consent.</li>
          <li>Contact {site.email} for any clarification regarding these terms.</li>
        </ul>
      </Modal>
    </footer>
  );
}

/* ---------- Fixed elements: WhatsApp FAB + sticky mobile CTA ---------- */

export function FloatingActions() {
  const fabRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shown = useRef({ fab: false, cta: false });

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: "#smooth-content",
      start: "top -600",
      end: 99999,
      onToggle: (self) => {
        if (self.isActive && !shown.current.fab) {
          shown.current.fab = true;
          if (fabRef.current) {
            if (prefersReduced()) gsap.set(fabRef.current, { opacity: 1, scale: 1 });
            else
              gsap.fromTo(
                fabRef.current,
                { opacity: 0, scale: 0 },
                { opacity: 1, scale: 1, duration: 0.6, ease: EASE.seal }
              );
          }
        }
      },
    });

    ScrollTrigger.create({
      trigger: ".hero",
      start: "bottom top",
      end: 99999,
      onToggle: (self) => {
        if (!ctaRef.current) return;
        if (self.isActive && !shown.current.cta) shown.current.cta = true;
        if (!shown.current.cta) return;
        gsap.to(ctaRef.current, {
          yPercent: self.isActive ? 0 : 110,
          duration: prefersReduced() ? 0 : 0.4,
          ease: EASE.ink,
          overwrite: true,
        });
      },
    });
  });

  return (
    <>
      <a
        ref={fabRef}
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Complianto on WhatsApp"
        className="fab-pulse group relative fixed bottom-6 right-5 z-[65] flex items-center gap-0 rounded-full bg-success p-3.5 text-white opacity-0 shadow-[0_10px_30px_rgba(18,128,92,0.35)] transition-shadow hover:shadow-[0_14px_36px_rgba(18,128,92,0.5)] md:bottom-8 md:right-8"
      >
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-[3px] bg-ink px-3 py-1.5 text-[12px] font-bold text-paper opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 md:block">
          Chat on WhatsApp
        </span>
        <MessageCircle size={22} strokeWidth={2} aria-hidden="true" />
      </a>

      <div
        ref={ctaRef}
        className="fixed inset-x-0 bottom-0 z-[64] border-t border-line bg-paper/95 p-3 backdrop-blur-sm md:hidden"
        style={{ transform: "translateY(110%)" }}
      >
        <a
          href="#consultation"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("consultation");
          }}
          className="btn btn-primary w-full !py-3"
        >
          Get free consultation
        </a>
      </div>
    </>
  );
}
