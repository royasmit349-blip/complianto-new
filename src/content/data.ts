import {
  Building2,
  Users,
  UserRound,
  FileCheck2,
  Receipt,
  Stamp,
  Rocket,
  HeartHandshake,
  Calculator,
  ShieldCheck,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

/* ============================================================
   ACCURACY LAW — never invent regulated facts.
   Values marked null are withheld until the client confirms.
   Deadlines are INDICATIVE and carry a visible disclaimer.
   ============================================================ */

export const site = {
  name: "Complianto",
  tagline: "Your Compliance Partner",
  phone: "+91 92160 29676",
  whatsapp: "919216029676",
  email: "services@complianto.in",
  address: "Noida, Uttar Pradesh, India", // «full street address — client to confirm»
  hours: "Mon–Sat · 10:00–19:00 IST",
};

export type Category =
  | "Start a Business"
  | "Licenses"
  | "Trademark & IP"
  | "Income Tax"
  | "Compliances"
  | "Labour"
  | "Digital Marketing";

export const CATEGORIES: Category[] = [
  "Start a Business",
  "Licenses",
  "Trademark & IP",
  "Income Tax",
  "Compliances",
  "Labour",
  "Digital Marketing",
];

export type Service = {
  id: string;
  title: string;
  blurb: string;
  category: Category;
  icon: LucideIcon;
};

export const SERVICES: Service[] = [
  {
    id: "company-registration",
    title: "Company Registration",
    blurb: "Register your business with the ROC under the Companies Act, 2013 — in the right structure for your stage.",
    category: "Start a Business",
    icon: Building2,
  },
  {
    id: "llp-registration",
    title: "LLP Registration",
    blurb: "Limited liability with partnership flexibility — ideal for professional firms and small teams.",
    category: "Start a Business",
    icon: Users,
  },
  {
    id: "opc-registration",
    title: "OPC Registration",
    blurb: "Run a company on your own, with no partner required.",
    category: "Start a Business",
    icon: UserRound,
  },
  {
    id: "startup-india",
    title: "Startup India Registration",
    blurb: "DPIIT recognition that unlocks startup schemes and tax benefits.",
    category: "Start a Business",
    icon: Rocket,
  },
  {
    id: "gst",
    title: "GST Registration & Returns",
    blurb: "Get GST-registered and keep every filing cycle on time.",
    category: "Licenses",
    icon: Receipt,
  },
  {
    id: "12a-80g",
    title: "12A & 80G",
    blurb: "Tax registrations that give NGOs exemptions and their donors deductions.",
    category: "Licenses",
    icon: HeartHandshake,
  },
  {
    id: "trademark",
    title: "Trademark Registration",
    blurb: "Protect your brand name, logo or symbol with exclusive legal rights.",
    category: "Trademark & IP",
    icon: Stamp,
  },
  {
    id: "bookkeeping",
    title: "Bookkeeping & Accounting",
    blurb: "Accurate, systematic financial records and statements, maintained for you.",
    category: "Income Tax",
    icon: Calculator,
  },
  {
    id: "roc-compliances",
    title: "ROC Compliances",
    blurb: "Maintain statutory registers and file annual forms so your company stays in good legal standing.",
    category: "Compliances",
    icon: FileCheck2,
  },
  {
    id: "pf-esi",
    title: "PF & ESI Compliance",
    blurb: "Payroll-linked labour registrations and monthly filings, handled.",
    category: "Labour",
    icon: ShieldCheck,
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    blurb: "Websites, search and campaigns that keep your brand visible — while we keep it compliant.",
    category: "Digital Marketing",
    icon: Megaphone,
  },
];

/* ---------- The Compliance Journey ---------- */

export type Act = {
  num: string;
  label: string;
  heading: string;
  copy: string;
  nodes: string[];
  art: "certificate" | "ledger" | "growth";
};

export const ACTS: Act[] = [
  {
    num: "01",
    label: "START",
    heading: "Start your business",
    copy: "Turn your idea into a legal entity. We handle incorporation, registrations and the licences you need to open for business — quickly, and correctly the first time.",
    nodes: ["Private Limited", "LLP", "OPC", "Startup India", "GST", "MSME", "Trademark"],
    art: "certificate",
  },
  {
    num: "02",
    label: "MANAGE",
    heading: "Manage your business",
    copy: "Stay compliant without thinking about it. Bookkeeping, ROC filings, income tax returns, TDS and payroll compliance — handled on schedule, every time.",
    nodes: ["Bookkeeping & Accounting", "ROC Annual Compliances", "ITR & TDS", "PF & ESI", "Virtual CFO"],
    art: "ledger",
  },
  {
    num: "03",
    label: "SCALE",
    heading: "Scale your business",
    copy: "Grow with confidence. From ISO certification and 12A/80G to ongoing AMC compliance and advisory, we keep your foundation solid as you expand.",
    nodes: ["ISO Certification", "12A & 80G", "Pvt Ltd & LLP AMC", "FSSAI", "Advisory"],
    art: "growth",
  },
];

/* ---------- Why Complianto ---------- */

export const PILLARS = [
  { title: "Accessibility", copy: "Reach us easily and get professional support when you need it." },
  { title: "Transparent pricing", copy: "Clear, affordable pricing with no hidden charges. Government fees are billed at actuals." },
  { title: "Confidentiality", copy: "Your company information and trademarks stay protected under confidentiality agreements." },
  { title: "Expertise", copy: "Qualified, experienced professionals across finance, legal and compliance." },
  { title: "Personalised service", copy: "Different business, different needs — solutions tailored to yours." },
  { title: "Prompt response", copy: "Quick turnarounds, with proactive updates by call and WhatsApp." },
] as const;

/* ---------- Stats — only confirmed figures. null = omit. ---------- */

export const STATS = {
  clientsServed: 20000 as number | null, // confirmed
  serviceLines: SERVICES.length as number | null, // derived from this brief
  supportDays: 6 as number | null, // Mon–Sat, per stated working hours
  yearsExperience: null as number | null, // «client to confirm»
  teamMembers: null as number | null, // «client to confirm»
  registrationsDone: null as number | null, // «client to confirm»
};

/* ---------- Deadline tracker (indicative — «client/CA to verify») ---------- */

export type Entity = "Private Limited" | "LLP" | "OPC" | "Proprietorship";
export const ENTITIES: Entity[] = ["Private Limited", "LLP", "OPC", "Proprietorship"];

export type DeadlineRow = { form: string; what: string; due: string };

export const DEADLINES: Record<Entity, DeadlineRow[]> = {
  "Private Limited": [
    { form: "GSTR-1", what: "Outward supplies details", due: "11th of next month (monthly filers)" },
    { form: "GSTR-3B", what: "GST return & tax payment", due: "20th of next month" },
    { form: "TDS deposit", what: "Tax deducted at source", due: "7th of next month" },
    { form: "PF & ESI", what: "Payroll contributions", due: "15th of next month" },
    { form: "AOC-4", what: "Financial statements to ROC", due: "Within 30 days of AGM" },
    { form: "MGT-7", what: "Annual return to ROC", due: "Within 60 days of AGM" },
    { form: "ITR-6", what: "Income tax return", due: "31 Oct (audit cases)" },
  ],
  LLP: [
    { form: "GSTR-3B", what: "GST return & tax payment", due: "20th of next month" },
    { form: "TDS deposit", what: "Tax deducted at source", due: "7th of next month" },
    { form: "Form 11", what: "LLP annual return", due: "30 May each year" },
    { form: "Form 8", what: "Statement of accounts", due: "30 Oct each year" },
    { form: "ITR-5", what: "Income tax return", due: "31 Jul (non-audit)" },
  ],
  OPC: [
    { form: "GSTR-3B", what: "GST return & tax payment", due: "20th of next month" },
    { form: "TDS deposit", what: "Tax deducted at source", due: "7th of next month" },
    { form: "AOC-4", what: "Financial statements to ROC", due: "Within 30 days of AGM" },
    { form: "MGT-7", what: "Annual return to ROC", due: "Within 60 days of AGM" },
    { form: "ITR-6", what: "Income tax return", due: "31 Oct (audit cases)" },
  ],
  Proprietorship: [
    { form: "GSTR-3B", what: "GST return & tax payment", due: "20th of next month" },
    { form: "TDS deposit", what: "Tax deducted at source", due: "7th of next month" },
    { form: "Advance tax", what: "Quarterly instalments", due: "15 Jun · Sep · Dec · Mar" },
    { form: "ITR-3 / 4", what: "Income tax return", due: "31 Jul (non-audit)" },
  ],
};

export const DEADLINE_DISCLAIMER =
  "Indicative dates for general guidance. Confirm your specific obligations with our team.";

/* ---------- Team — names/bios are placeholders, client to replace ---------- */

export const TEAM = [
  { name: "Aarav Mehta", role: "Founder · Compliance Practice", line: "Sets the standard for every filing that leaves the firm." },
  { name: "Priya Nair", role: "Head of Registrations & ROC", line: "Leads incorporation and MCA filings end-to-end." },
  { name: "Kabir Sethi", role: "Tax & Filings Lead", line: "Keeps GST, TDS and ITR cycles on schedule." },
  { name: "Sana Qureshi", role: "Client Success Manager", line: "Your first call — and the reason updates arrive early." },
];

/* ---------- Testimonials — placeholder attributions, replace with real consented quotes ---------- */

export const TESTIMONIALS = [
  { quote: "Making a new LLP was superfast and they guided me at every step.", who: "Founder, LLP", where: "Delhi" },
  { quote: "A dedicated person was assigned to us, with updates on call and WhatsApp — top-notch service for our compliance.", who: "Director, Pvt Ltd", where: "Noida" },
  { quote: "Clear pricing, no surprises. The GST registration was done well before they promised.", who: "Proprietor", where: "Jaipur" },
  { quote: "They flagged an ROC deadline I'd completely missed. That alone paid for the service.", who: "Co-founder, Startup", where: "Gurugram" },
];

/* ---------- Blog seeds ---------- */

export const POSTS = [
  {
    id: "inc-20a",
    category: "ROC",
    title: "INC-20A filing: the business commencement declaration",
    mins: 6,
    excerpt: "Every company incorporated after Nov 2018 must file a declaration of commencement before it starts business or borrows money.",
    body: [
      "Form INC-20A is the declaration that a company has received its paid-up capital and is ready to begin business. It is filed with the ROC within 180 days of incorporation, and without it a company cannot lawfully commence operations or borrow money.",
      "The filing needs details of each subscriber, the value of shares paid for, and registered-office verification if that is still pending. Miss the window and the company — and its officers — face penalties, with the added risk of the registrar initiating strike-off for prolonged non-filing.",
      "Our practice: treat INC-20A as part of incorporation itself, not a follow-up. The bank account opens, capital is deposited, and the declaration goes out inside the same fortnight.",
    ],
  },
  {
    id: "80iac",
    category: "Income Tax",
    title: "Startup tax exemption under Section 80-IAC",
    mins: 7,
    excerpt: "DPIIT-recognised startups can claim a three-year income tax holiday — if the paperwork is in order before the year ends.",
    body: [
      "Section 80-IAC lets an eligible startup deduct 100% of its profits for three consecutive years out of its first ten. Eligibility hinges on DPIIT recognition, vintage, turnover limits and the nature of the business.",
      "The exemption is not automatic: it must be claimed in the return for the relevant year, and the startup must be able to show it is working towards innovation, development or improvement of products or processes.",
      "Founders usually discover 80-IAC one year too late. We map the three most valuable years against your revenue trajectory during incorporation, so the holiday lands where it matters.",
    ],
  },
  {
    id: "gst-2026",
    category: "GST",
    title: "A founder's guide to GST registration in 2026",
    mins: 8,
    excerpt: "When registration is compulsory, when it is voluntary, and the documents that decide how fast your application clears.",
    body: [
      "GST registration becomes compulsory once taxable turnover crosses the threshold, or immediately — regardless of turnover — for inter-state suppliers, e-commerce sellers and certain categories of business.",
      "Voluntary registration is often worth it even below the threshold: it unlocks input tax credit and removes friction with larger customers who prefer to buy from registered vendors.",
      "Applications stall most often on premises proof and bank details. Prepare the rental or ownership document, a recent bank statement and promoter KYC upfront, and the process usually clears without a notice.",
    ],
  },
];
