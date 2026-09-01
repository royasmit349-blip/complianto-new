import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SectionHead, cn } from "../components/ui";
import { SealStamp, ShieldCheckDraw } from "../components/illustrations";
import { SERVICES, site } from "../content/data";
import { gsap, useGSAP, ScrollTrigger, drawIn, listen, EVT_PREFILL, prefersReduced, EASE } from "../lib/gsap";

type Errors = Partial<Record<"name" | "city" | "mobile" | "email" | "service" | "consent", string>>;

const COUNTRIES = ["+91", "+971", "+65", "+44", "+1"];

export function Consultation() {
  const root = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const submitBtn = useRef<HTMLButtonElement>(null);

  const [vals, setVals] = useState({ name: "", city: "", cc: "+91", mobile: "", email: "", service: "", query: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const honeypot = useRef<HTMLInputElement>(null);

  /* Prefills from deadline tracker / service cards */
  useEffect(
    () =>
      listen(EVT_PREFILL, (detail) => {
        const d = detail as { service?: string; query?: string };
        setVals((v) => ({
          ...v,
          service: d.service && SERVICES.some((s) => s.title === d.service) ? d.service : v.service,
          query: d.query ?? v.query,
        }));
      }),
    []
  );

  /* Panel + fields entrance; the seal fires as the closing beat */
  useGSAP(
    () => {
      if (prefersReduced() || !root.current) return;
      gsap.from(panelRef.current, {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: EASE.ink,
        scrollTrigger: { trigger: panelRef.current, start: "top 82%", once: true },
      });
      const fields = panelRef.current?.querySelectorAll(".field, [data-form-row]");
      if (fields?.length) {
        gsap.from(fields, {
          opacity: 0,
          y: 14,
          duration: 0.5,
          stagger: 0.05,
          ease: EASE.ink,
          scrollTrigger: { trigger: panelRef.current, start: "top 82%", once: true },
        });
      }

      ScrollTrigger.create({
        trigger: sealRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const seal = sealRef.current;
          if (!seal) return;
          const svg = seal.querySelector("svg");
          const dashed = seal.querySelectorAll("circle")[1];
          gsap.fromTo(
            svg,
            { scale: 0.6, rotate: -10 },
            { keyframes: { scale: [0.6, 1.15, 1], rotate: [ -10, 4, 0 ] }, duration: 0.6, ease: "power2.out" }
          );
          if (dashed) gsap.fromTo(dashed, { rotate: 0 }, { rotate: 180, duration: 0.9, ease: EASE.glide, transformOrigin: "center center" });
          drawIn(seal, { duration: 0.7, stagger: 0.15 });
        },
      });
    },
    { scope: root }
  );

  const set = (k: keyof typeof vals) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setVals((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k === "cc" ? "mobile" : k]: undefined }));
  };

  const validate = (): Errors => {
    const er: Errors = {};
    if (vals.name.trim().length < 2) er.name = "Please tell us your name.";
    if (vals.city.trim().length < 2) er.city = "Which city are you in?";
    if (!/^\d{10}$/.test(vals.mobile.replace(/\s/g, ""))) er.mobile = "Enter a valid 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email.trim())) er.email = "We need an email to send your confirmation.";
    if (!vals.service) er.service = "Choose the service you need help with.";
    if (!consent) er.consent = "Please confirm you're happy to be contacted.";
    return er;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    const er = validate();
    setErrors(er);
    const keys = Object.keys(er) as (keyof Errors)[];
    if (keys.length) {
      const first = panelRef.current?.querySelector<HTMLElement>(`[data-field="${keys[0]}"]`);
      if (first && !prefersReduced()) {
        /* one shake per submit, never more */
        gsap.fromTo(first, { x: 0 }, { keyframes: { x: [-6, 6, -4, 4, 0] }, duration: 0.35, ease: "power2.out", overwrite: true });
      }
      (first?.querySelector("input, select, textarea") as HTMLElement | null)?.focus();
      return;
    }
    /* lock width so the spinner never reflows the button */
    if (submitBtn.current) submitBtn.current.style.minWidth = `${submitBtn.current.offsetWidth}px`;
    setStatus("submitting");
    if (honeypot.current?.value) {
      setStatus("success");
      return;
    }
    await new Promise((r) => setTimeout(r, 1200)); /* POST /api/consultation → Resend in production */
    setStatus("success");
  };

  /* success panel draw-in */
  useEffect(() => {
    if (status !== "success" || !successRef.current) return;
    if (prefersReduced()) return;
    drawIn(successRef.current, { duration: 0.8, stagger: 0.2 });
    gsap.from(successRef.current.querySelectorAll("[data-rise]"), {
      opacity: 0,
      y: 16,
      duration: 0.5,
      stagger: 0.08,
      ease: EASE.ink,
      delay: 0.3,
    });
  }, [status]);

  const field = (k: keyof typeof vals) => cn("field", vals[k] && "filled", errors[k as keyof Errors] && "has-error");

  return (
    <section id="consultation" ref={root} className="relative overflow-hidden bg-elevated py-24 md:py-40">
      <div className="grid-bg absolute inset-0 rotate-180 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1240px] items-start gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHead eyebrow="Free consultation" title="Ready to get compliant? Let's talk." />
          <p className="mt-5 max-w-[440px] text-[14.5px] leading-relaxed text-muted">
            Book a free consultation — no obligation. Tell us where your business is, and we'll
            tell you exactly what comes next.
          </p>

          <div ref={sealRef} className="mt-10 w-[104px]">
            <SealStamp className="w-full" />
          </div>

          <ul className="mt-10 space-y-4 text-[14px] font-semibold text-ink-80">
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="group flex items-center gap-3.5 transition-colors hover:text-accent-strong">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-accent-strong transition-colors group-hover:border-accent">
                  <Phone size={16} />
                </span>
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="group flex items-center gap-3.5 transition-colors hover:text-accent-strong">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-accent-strong transition-colors group-hover:border-accent">
                  <Mail size={16} />
                </span>
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-accent-strong">
                <MapPin size={16} />
              </span>
              {site.address}
            </li>
            <li className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-accent-strong">
                <Clock size={16} />
              </span>
              {site.hours}
            </li>
          </ul>
        </div>

        <div ref={panelRef} className="relative rounded-[16px] border border-line bg-paper p-7 shadow-[0_28px_64px_rgba(10,10,10,0.08)] md:p-9">
          {status === "success" ? (
            <div ref={successRef} className="flex min-h-[460px] flex-col items-center justify-center text-center" aria-live="polite">
              <ShieldCheckDraw className="w-24" />
              <h3 data-rise className="mt-6 font-display text-2xl font-black text-ink">
                Thanks — we'll call you within one business day.
              </h3>
              <p data-rise className="mt-3 max-w-[340px] text-[13.5px] leading-relaxed text-muted">
                A confirmation is on its way to <strong className="text-ink">{vals.email}</strong>. Keep your
                phone close — {vals.name.split(" ")[0]}, this is the easy part.
              </p>
              <button
                data-rise
                onClick={() => {
                  setVals({ name: "", city: "", cc: "+91", mobile: "", email: "", service: "", query: "" });
                  setConsent(false);
                  setStatus("idle");
                }}
                className="btn btn-ghost mt-8 !py-2.5 text-[13px]"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <p className="font-display text-lg font-bold text-ink">Book your free consultation</p>
              <p className="mt-1 text-[12.5px] font-semibold text-muted">Takes under a minute. No spam, ever.</p>

              {/* honeypot */}
              <input ref={honeypot} type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div data-field="name" className={field("name")}>
                  <label htmlFor="f-name">Full name</label>
                  <input id="f-name" type="text" value={vals.name} onChange={set("name")} aria-invalid={!!errors.name} />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>
                <div data-field="city" className={field("city")}>
                  <label htmlFor="f-city">City</label>
                  <input id="f-city" type="text" value={vals.city} onChange={set("city")} aria-invalid={!!errors.city} />
                  {errors.city && <p className="field-error">{errors.city}</p>}
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div data-field="mobile" className={cn(field("mobile"), "flex")}>
                  <div className="w-full">
                    <label htmlFor="f-mobile">Mobile number</label>
                    <div className="flex items-center gap-2 border-b border-line">
                      <select
                        value={vals.cc}
                        onChange={set("cc")}
                        aria-label="Country code"
                        className="border-0 bg-transparent py-[0.45rem] text-[14px] font-bold text-ink focus:outline-none"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <input
                        id="f-mobile"
                        type="tel"
                        inputMode="numeric"
                        className="!border-0 flex-1"
                        value={vals.mobile}
                        onChange={set("mobile")}
                        aria-invalid={!!errors.mobile}
                        placeholder="98765 43210"
                      />
                    </div>
                  </div>
                  {errors.mobile && <p className="field-error absolute">{errors.mobile}</p>}
                </div>
                <div data-field="email" className={field("email")}>
                  <label htmlFor="f-email">Email</label>
                  <input id="f-email" type="email" value={vals.email} onChange={set("email")} aria-invalid={!!errors.email} />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>
              </div>

              <div data-field="service" className={cn(field("service"), "mt-5")}>
                <label htmlFor="f-service">Service of interest</label>
                <select id="f-service" value={vals.service} onChange={set("service")} aria-invalid={!!errors.service} className={cn(!vals.service && "text-muted")}>
                  <option value="" disabled>
                    Select a service
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="General consultation">General consultation</option>
                </select>
                {errors.service && <p className="field-error">{errors.service}</p>}
              </div>

              <div className={cn(field("query"), "mt-5 filled")}>
                <label htmlFor="f-query">Your query (optional)</label>
                <textarea id="f-query" rows={3} value={vals.query} onChange={set("query")} className="resize-none" />
              </div>

              <div data-field="consent" data-form-row className="mt-6">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      setErrors((er) => ({ ...er, consent: undefined }));
                    }}
                    className="peer sr-only"
                    aria-invalid={!!errors.consent}
                  />
                  <span
                    className={cn(
                      "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-all duration-200",
                      consent ? "border-accent bg-accent" : errors.consent ? "border-danger bg-paper" : "border-line bg-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent"
                    )}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className={cn("transition-opacity", consent ? "opacity-100" : "opacity-0")}>
                      <path d="M4 12.5 L9.5 18 L20 6.5" stroke="var(--color-accent-ink)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[12.5px] leading-relaxed text-muted">
                    I agree to be contacted by Complianto about my enquiry. See our privacy practices —
                    your details are never shared.
                  </span>
                </label>
                {errors.consent && <p className="field-error">{errors.consent}</p>}
              </div>

              <button ref={submitBtn} type="submit" data-form-row className="btn btn-primary mt-7 w-full" disabled={status === "submitting"}>
                {status === "submitting" ? (
                  <span className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  "Send my request"
                )}
              </button>
              <p className="mt-3 text-center text-[11.5px] font-semibold text-muted">
                We respond within one business day — usually much faster.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
