import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  FileText,
  Bell,
  Shield,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  TrendingDown,
  Clock,
  Lightbulb,
  Star,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-body overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1A5276] rounded-xl flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
            </div>
            <span className="font-display font-bold text-[#1A5276] text-xl tracking-tight">
              TaxiPoa
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {["How it works", "Features", "Pricing"].map((item) => (
              <a
                key={item}
                href={"#" + item.toLowerCase().replace(/\s+/g, "-")}
                className="text-slate-500 hover:text-slate-800 text-sm font-body transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-slate-600 hover:text-slate-800 text-sm font-medium font-body transition-colors cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-[#1A5276] hover:bg-[#154360] text-white text-sm font-display font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 cursor-pointer"
            >
              Get started free
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
            {["How it works", "Features", "Pricing"].map((item) => (
              <a
                key={item}
                href={"#" + item.toLowerCase().replace(/\s+/g, "-")}
                onClick={() => setMenuOpen(false)}
                className="block text-slate-600 text-sm font-body py-1"
              >
                {item}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => navigate("/login")}
                className="w-full py-2.5 border border-slate-200 text-slate-700 font-display font-semibold text-sm rounded-xl cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full py-2.5 bg-[#1A5276] text-white font-display font-semibold text-sm rounded-xl cursor-pointer"
              >
                Get started free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-slate-50 via-blue-50/40 to-white relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-[#1A5276] text-xs font-medium font-body mb-6">
            <div className="w-1.5 h-1.5 bg-[#1E8449] rounded-full animate-pulse" />
            Built for Kenya · KRA iTax compatible
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Know exactly what
            <br />
            <span className="text-[#1A5276] relative">
              to pay KRA
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 10 Q75 2 150 8 Q225 14 298 6"
                  stroke="#2E86C1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>{" "}
             before you file.
          </h1>

          {/* Subheadline */}
          <p className="text-slate-500 text-xl font-body leading-relaxed mb-10 max-w-2xl mx-auto">
            TaxiPoa helps Kenyan freelancers, gig workers and small business
            owners calculate their tax liability, understand their deductions,
            and get a clear iTax reference summary {" "}
            <span className="text-slate-700 font-medium">
              so filing on KRA iTax takes minutes, not hours.
            </span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <button
              onClick={() => navigate("/register")}
              className="flex items-center justify-center gap-2 bg-[#1A5276] hover:bg-[#154360] text-white font-display font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-blue-900/25 hover:-translate-y-0.5 text-base cursor-pointer"
            >
              Calculate my tax free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-display font-semibold px-8 py-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-200 text-base cursor-pointer"
            >
              See how it works
            </button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400 font-body">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#1E8449]" />
              Free to start - no credit card
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#1E8449]" />
              Income Tax and TOT comparison
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#1E8449]" />
              PDF summary for iTax reference
            </div>
          </div>
        </div>

        {/* Hero card mockup */}
        <div className="max-w-lg mx-auto mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 p-6 relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-slate-400 text-xs font-body">
                  Tax Year 2025
                </p>
                <p className="font-display font-bold text-slate-800">
                  Your Tax Summary
                </p>
              </div>
              <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-100 font-body">
                Calculated
              </span>
            </div>

            {[
              {
                label: "Gross Income",
                value: "KES 850,000",
                color: "text-slate-800",
                bold: false,
              },
              {
                label: "Less: Deductions",
                value: "(KES 95,000)",
                color: "text-green-600",
                bold: false,
              },
              {
                label: "Taxable Income",
                value: "KES 755,000",
                color: "text-blue-700",
                bold: true,
              },
              {
                label: "Less: Personal Relief",
                value: "(KES 28,800)",
                color: "text-green-600",
                bold: false,
              },
              {
                label: "Withholding Tax Paid",
                value: "(KES 42,500)",
                color: "text-green-600",
                bold: false,
              },
            ].map(({ label, value, color, bold }) => (
              <div
                key={label}
                className={
                  "flex justify-between py-2 border-b border-slate-50 last:border-0 " +
                  (bold ? "bg-blue-50 px-3 rounded-lg -mx-3" : "")
                }
              >
                <span className="text-slate-500 text-sm font-body">
                  {label}
                </span>
                <span className={"text-sm font-display font-semibold " + color}>
                  {value}
                </span>
              </div>
            ))}

            <div className="mt-4 bg-[#1A5276] rounded-xl p-4 text-center">
              <p className="text-blue-200 text-xs font-body mb-1">
                Net Tax Payable to KRA
              </p>
              <p className="font-display text-3xl font-bold text-white">
                KES 43,220
              </p>
              <p className="text-blue-300 text-xs font-body mt-1">
                Pay via M-Pesa  · Use your PRN as account
              </p>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -top-4 -right-4 bg-[#1E8449] text-white text-xs font-display font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-green-900/30 z-20">
            Saves you KES 12,400 vs TOT
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-red-50 text-red-700 text-xs font-medium px-3 py-1 rounded-full border border-red-100 font-body mb-4">
                The Problem
              </div>
              <h2 className="font-display text-4xl font-bold text-slate-800 leading-tight mb-6">
                The KRA iTax portal is confusing.
                <br />
                <span className="text-red-500">Penalties are not.</span>
              </h2>
              <p className="text-slate-500 font-body leading-relaxed mb-6">
                Most Kenyan freelancers and gig workers miss the June 30
                deadline, fill in wrong figures, or don't know which tax type
                applies to them  and end up paying penalties they could have
                avoided.
              </p>
              <div className="space-y-3">
                {[
                  "Late filing penalty: KES 2,000 or 5% of tax due — whichever is higher",
                  "Late payment: 1% interest per month on unpaid balance",
                  "KRA now cross-checks M-Pesa and bank statements automatically",
                  "Most freelancers do not know they can deduct work expenses",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    </div>
                    <p className="text-slate-600 text-sm font-body">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="text-center mb-6">
                <div className="font-display text-5xl font-bold text-red-500 mb-1">
                  392K
                </div>
                <p className="text-slate-500 text-sm font-body">
                  Kenyans flagged for non-compliance in 2025
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Didn't know deadline", pct: 68 },
                  { label: "Filed wrong amounts", pct: 45 },
                  { label: "Missed deductions", pct: 81 },
                ].map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-body text-slate-500 mb-1">
                      <span>{label}</span>
                      <span className="font-medium text-slate-700">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                        style={{ width: pct + "%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-xs font-body text-center mt-4">
                * Estimates based on KRA compliance reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-blue-50 text-[#1A5276] text-xs font-medium px-3 py-1 rounded-full border border-blue-100 font-body mb-4">
              How It Works
            </div>
            <h2 className="font-display text-4xl font-bold text-slate-800 mb-4">
              From confusion to clarity
              <br />
              in four steps
            </h2>
            <p className="text-slate-500 font-body max-w-xl mx-auto">
              TaxiPoa does not file on your behalf. It prepares everything so
              that when you sit down on iTax, you know exactly what to enter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: <TrendingDown className="w-6 h-6 text-[#1A5276]" />,
                title: "Enter your income",
                desc: "Add all payments you received  freelance, salary, rental, or business. Include any withholding tax your clients deducted.",
                color: "bg-blue-50",
              },
              {
                step: "02",
                icon: <FileText className="w-6 h-6 text-green-600" />,
                title: "Log your expenses",
                desc: "Add work-related costs  laptop, internet, software, transport, home office. TaxiPoa flags what KRA allows as deductions.",
                color: "bg-green-50",
              },
              {
                step: "03",
                icon: <Calculator className="w-6 h-6 text-orange-600" />,
                title: "We calculate both options",
                desc: "TaxiPoa computes your Income Tax and Turnover Tax side by side, then recommends whichever saves you more money.",
                color: "bg-orange-50",
              },
              {
                step: "04",
                icon: <FileText className="w-6 h-6 text-purple-600" />,
                title: "Get your iTax summary",
                desc: "Download your personalised PDF with every figure pre-calculated. Use it as your reference when filing on itax.kra.go.ke.",
                color: "bg-purple-50",
              },
            ].map(({ step, icon, title, desc, color }) => (
              <div
                key={step}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={
                      "w-12 h-12 " +
                      color +
                      " rounded-xl flex items-center justify-center"
                    }
                  >
                    {icon}
                  </div>
                  <span className="font-display font-bold text-3xl text-slate-100">
                    {step}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-slate-800 mb-2">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm font-body leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[#1A5276] rounded-2xl p-6 text-center">
            <p className="text-blue-100 font-body text-sm mb-1">
              After step 4 - you go to
            </p>
            <p className="font-display text-white text-lg font-bold mb-1">
              itax.kra.go.ke
            </p>
            <p className="text-blue-200 font-body text-sm">
              and enter the figures from your TaxiPoa summary. Filing takes
              under 10 minutes when you know what to fill.
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-blue-50 text-[#1A5276] text-xs font-medium px-3 py-1 rounded-full border border-blue-100 font-body mb-4">
              Features
            </div>
            <h2 className="font-display text-4xl font-bold text-slate-800 mb-4">
              Everything you need to
              <br />
              file with confidence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Calculator className="w-6 h-6 text-[#1A5276]" />,
                bg: "bg-blue-50",
                title: "Income Tax vs TOT Comparison",
                desc: "We calculate both Individual Income Tax and Turnover Tax for your situation, then recommend the one that costs you less.",
              },
              {
                icon: <TrendingDown className="w-6 h-6 text-green-600" />,
                bg: "bg-green-50",
                title: "Deduction Tracker",
                desc: "Log all your work expenses  internet, equipment, home office, transport. TaxiPoa flags which ones KRA allows so you only claim what is valid.",
              },
              {
                icon: <FileText className="w-6 h-6 text-orange-600" />,
                bg: "bg-orange-50",
                title: "iTax Reference PDF",
                desc: "Download a personalised PDF with every figure pre-calculated  gross income, deductions, tax bands, WHT credits, and net amount to pay.",
              },
              {
                icon: <Bell className="w-6 h-6 text-purple-600" />,
                bg: "bg-purple-50",
                title: "Deadline SMS Reminders",
                desc: "Get automatic SMS alerts 30, 7, and 1 day before the June 30 KRA deadline  so you are never caught off guard.",
              },
              {
                icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
                bg: "bg-yellow-50",
                title: "Plain-Language Guidance",
                desc: "No tax jargon. TaxiPoa explains every line in simple English and Swahili so you understand what you are filling in, not just what the number is.",
              },
              {
                icon: <Shield className="w-6 h-6 text-slate-600" />,
                bg: "bg-slate-100",
                title: "Secure and Private",
                desc: "Your financial data is encrypted. TaxiPoa never shares your information with KRA or third parties it is your private preparation tool.",
              },
            ].map(({ icon, bg, title, desc }) => (
              <div
                key={title}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-200 group"
              >
                <div
                  className={
                    "w-11 h-11 " +
                    bg +
                    " rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200"
                  }
                >
                  {icon}
                </div>
                <h3 className="font-display font-semibold text-slate-800 mb-2">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm font-body leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-slate-800 mb-4">
              Built for people KRA
              <br />
              often overlooks
            </h2>
            <p className="text-slate-500 font-body">
              If you earn money outside a formal payroll, TaxiPoa is for you.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Freelancers",
                desc: "Designers, developers, writers, photographers",
              },
              {
                label: "Consultants",
                desc: "Trainers, advisors, project managers",
              },
              {
                label: "Gig workers",
                desc: "Uber, Bolt, delivery, bodaboda riders",
              },
              {
                label: "Side hustlers",
                desc: "Anyone earning outside their main salary",
              },
              {
                label: "Online sellers",
                desc: "Instagram, TikTok, and marketplace traders",
              },
              {
                label: "Content creators",
                desc: "YouTubers, podcasters, influencers",
              },
              {
                label: "Small traders",
                desc: "Micro-businesses and market vendors",
              },
              { label: "Landlords", desc: "Anyone earning rental income" },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-[#2E86C1] hover:shadow-sm transition-all duration-200"
              >
                <div className="w-8 h-8 bg-[#1A5276]/10 rounded-lg flex items-center justify-center mb-3">
                  <CheckCircle className="w-4 h-4 text-[#1A5276]" />
                </div>
                <div className="font-display font-semibold text-slate-800 text-sm mb-1">
                  {label}
                </div>
                <div className="text-slate-400 text-xs font-body">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-50 text-[#1A5276] text-xs font-medium px-3 py-1 rounded-full border border-blue-100 font-body mb-4">
              Pricing
            </div>
            <h2 className="font-display text-4xl font-bold text-slate-800 mb-4">
              Simple pricing.
              <br />
              Pay less than one KRA penalty.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "KES 0",
                period: "forever",
                desc: "Get started and understand your tax position",
                features: [
                  "1 tax filing per year",
                  "Income Tax calculation",
                  "TOT comparison",
                  "Basic deduction tracking",
                ],
                cta: "Start for free",
                highlight: false,
              },
              {
                name: "Basic",
                price: "KES 499",
                period: "per year",
                desc: "Everything you need to prepare and file confidently",
                features: [
                  "Unlimited filings",
                  "PDF iTax reference summary",
                  "SMS deadline reminders",
                  "Full expense tracking",
                  "Filing history",
                ],
                cta: "Get Basic",
                highlight: true,
              },
              {
                name: "Pro",
                price: "KES 1,499",
                period: "per year",
                desc: "For freelancers with complex income and multiple clients",
                features: [
                  "Everything in Basic",
                  "Share summary with accountant",
                  "CSV export",
                  "VAT registration alerts",
                  "Priority WhatsApp support",
                ],
                cta: "Get Pro",
                highlight: false,
              },
            ].map(({ name, price, period, desc, features, cta, highlight }) => (
              <div
                key={name}
                className={
                  "rounded-2xl p-6 border transition-all duration-200 " +
                  (highlight
                    ? "bg-[#1A5276] border-[#1A5276] shadow-2xl shadow-blue-900/30 scale-105"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md")
                }
              >
                {highlight && (
                  <div className="bg-[#1E8449] text-white text-xs font-display font-bold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <div
                  className={
                    "text-sm font-medium font-body mb-1 " +
                    (highlight ? "text-blue-200" : "text-slate-500")
                  }
                >
                  {name}
                </div>
                <div
                  className={
                    "font-display font-bold text-3xl mb-0.5 " +
                    (highlight ? "text-white" : "text-slate-800")
                  }
                >
                  {price}
                </div>
                <div
                  className={
                    "text-xs font-body mb-4 " +
                    (highlight ? "text-blue-300" : "text-slate-400")
                  }
                >
                  {period}
                </div>
                <p
                  className={
                    "text-sm font-body mb-5 " +
                    (highlight ? "text-blue-100" : "text-slate-500")
                  }
                >
                  {desc}
                </p>
                <ul className="space-y-2.5 mb-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <CheckCircle
                        className={
                          "w-4 h-4 flex-shrink-0 " +
                          (highlight ? "text-[#1E8449]" : "text-green-500")
                        }
                      />
                      <span
                        className={
                          "text-sm font-body " +
                          (highlight ? "text-blue-50" : "text-slate-600")
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/register")}
                  className={
                    "w-full py-3 rounded-xl font-display font-semibold text-sm transition-all duration-200 cursor-pointer " +
                    (highlight
                      ? "bg-white text-[#1A5276] hover:bg-blue-50"
                      : "bg-[#1A5276] text-white hover:bg-[#154360]")
                  }
                >
                  {cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-400 text-xs font-body mt-6">
            All plans include a 7-day free trial of Basic features · Pay via
            M-Pesa · No credit card needed
          </p>
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <section className="py-10 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
            <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display font-semibold text-amber-900 text-sm mb-1">
                Important: What TaxiPoa does and does not do
              </h4>
              <p className="text-amber-800 text-sm font-body leading-relaxed">
                TaxiPoa is a{" "}
                <strong>tax preparation and calculation tool</strong> — not a
                tax filing service. We help you understand your tax position,
                calculate your liability, and prepare a reference summary. You
                are responsible for filing directly on{" "}
                <strong>itax.kra.go.ke</strong> using the figures we provide.
                For complex tax situations, always consult a qualified tax
                advisor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#1A5276] to-[#2E86C1] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Stop dreading KRA.
            <br />
            Start filing with confidence.
          </h2>
          <p className="text-blue-100 font-body text-lg mb-8">
            Join Kenyan freelancers who finally understand their taxes.
            Calculate your liability in minutes — it is free to start.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 bg-white text-[#1A5276] font-display font-bold px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-200 shadow-2xl hover:-translate-y-0.5 text-lg cursor-pointer"
          >
            Calculate my tax free
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-blue-200/70 text-xs font-body mt-4">
            Free forever plan · No credit card · Takes 2 minutes
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 bg-[#2E86C1] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                    />
                  </svg>
                </div>
                <span className="font-display font-bold text-white text-lg">
                  TaxiPoa
                </span>
              </div>
              <p className="text-slate-500 text-sm font-body leading-relaxed">
                Helping Kenyan freelancers and gig workers understand and
                prepare their KRA tax returns.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-display font-semibold text-white text-sm mb-3">
                  Product
                </p>
                <ul className="space-y-2">
                  {["How it works", "Features", "Pricing"].map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-slate-500 hover:text-slate-300 text-sm font-body transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-display font-semibold text-white text-sm mb-3">
                  Legal
                </p>
                <ul className="space-y-2">
                  {["Privacy Policy", "Terms of Service", "KRA Disclaimer"].map(
                    (l) => (
                      <li key={l}>
                        <a
                          href="#"
                          className="text-slate-500 hover:text-slate-300 text-sm font-body transition-colors"
                        >
                          {l}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-xs font-body">
              2026 TaxiPoa. Built in Kenya
            </p>
            <p className="text-slate-600 text-xs font-body text-center">
              TaxiPoa is a preparation tool only. Filing is done directly on
              itax.kra.go.ke.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
