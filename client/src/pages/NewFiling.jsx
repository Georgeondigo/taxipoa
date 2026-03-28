import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Briefcase,
  Home,
  ShoppingBag,
  CircleCheck,
} from "lucide-react";
import api from "../api/api";
import toast from "react-hot-toast";

const CURRENT_YEAR = new Date().getFullYear();
const TAX_YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3];

// ── Step indicators ────────────────────────────────────────────
function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-display font-semibold transition-all duration-300 ${
              index < currentStep
                ? "bg-[#1E8449] text-white"
                : index === currentStep
                  ? "bg-[#1A5276] text-white shadow-lg shadow-blue-900/30"
                  : "bg-slate-100 text-slate-400"
            }`}
          >
            {index < currentStep ? (
              <CircleCheck className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          <div className="ml-2 hidden sm:block">
            <div
              className={`text-xs font-medium font-body ${
                index === currentStep ? "text-slate-800" : "text-slate-400"
              }`}
            >
              {step}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-px mx-3 transition-all duration-300 ${
                index < currentStep ? "bg-[#1E8449]" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function NewFiling() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR - 1);
  const [incomeTypes, setIncomeTypes] = useState([]);
  const [taxType, setTaxType] = useState("income_tax");

  const steps = ["Tax Year", "Income Type", "Tax Method"];

  const toggleIncomeType = (type) => {
    setIncomeTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/filings", {
        taxYear: selectedYear,
        taxType,
      });
      const filing = res.data.data.filing;
      toast.success(`Filing for ${selectedYear} created!`);
      navigate(`/filings/${filing.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Could not create filing";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Header ── */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/filings")}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-body transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to filings
        </button>
        <h2 className="font-display text-2xl font-bold text-slate-800">
          New Tax Filing
        </h2>
        <p className="text-slate-500 text-sm font-body mt-1">
          Let's prepare your KRA tax summary — takes less than 2 minutes
        </p>
      </div>

      {/* ── Step Indicator ── */}
      <StepIndicator currentStep={step} steps={steps} />

      {/* ── Step Content ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        {/* STEP 0 — Tax Year */}
        {step === 0 && (
          <div>
            <h3 className="font-display text-xl font-bold text-slate-800 mb-2">
              Which tax year are you filing for?
            </h3>
            <p className="text-slate-500 text-sm font-body mb-6">
              KRA tax years run from January 1 to December 31. The deadline to
              file is June 30 of the following year.
            </p>

            <div className="space-y-3">
              {TAX_YEARS.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedYear === year
                      ? "border-[#1A5276] bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="text-left">
                    <div
                      className={`font-display font-semibold ${
                        selectedYear === year
                          ? "text-[#1A5276]"
                          : "text-slate-800"
                      }`}
                    >
                      Tax Year {year}
                    </div>
                    <div className="text-slate-500 text-xs font-body mt-0.5">
                      January 1 – December 31, {year}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {year === CURRENT_YEAR - 1 && (
                      <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full font-body">
                        Due soon
                      </span>
                    )}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedYear === year
                          ? "border-[#1A5276] bg-[#1A5276]"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedYear === year && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Income Types */}
        {step === 1 && (
          <div>
            <h3 className="font-display text-xl font-bold text-slate-800 mb-2">
              What types of income did you earn in {selectedYear}?
            </h3>
            <p className="text-slate-500 text-sm font-body mb-6">
              Select all that apply — you can add the actual amounts in the next
              step.
            </p>

            <div className="space-y-3">
              {[
                {
                  type: "freelance",
                  label: "Freelance / Consulting",
                  desc: "Payments from clients for services — design, dev, writing, training",
                  icon: <Briefcase className="w-5 h-5" />,
                  color: "text-blue-600 bg-blue-50",
                },
                {
                  type: "employment",
                  label: "Employment / Salary",
                  desc: "Regular salary from an employer — PAYE may already be deducted",
                  icon: <FileText className="w-5 h-5" />,
                  color: "text-green-600 bg-green-50",
                },
                {
                  type: "rental",
                  label: "Rental Income",
                  desc: "Income from renting out property or space",
                  icon: <Home className="w-5 h-5" />,
                  color: "text-orange-600 bg-orange-50",
                },
                {
                  type: "business",
                  label: "Business / Trade",
                  desc: "Sales from a business, shop, or online store",
                  icon: <ShoppingBag className="w-5 h-5" />,
                  color: "text-purple-600 bg-purple-50",
                },
              ].map(({ type, label, desc, icon, color }) => {
                const selected = incomeTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleIncomeType(type)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                      selected
                        ? "border-[#1A5276] bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
                    >
                      {icon}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`font-display font-semibold text-sm ${
                          selected ? "text-[#1A5276]" : "text-slate-800"
                        }`}
                      >
                        {label}
                      </div>
                      <div className="text-slate-500 text-xs font-body mt-0.5">
                        {desc}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selected
                          ? "border-[#1A5276] bg-[#1A5276]"
                          : "border-slate-300"
                      }`}
                    >
                      {selected && (
                        <CircleCheck className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {incomeTypes.length === 0 && (
              <p className="text-orange-600 text-xs font-body mt-3 flex items-center gap-1">
                Please select at least one income type to continue
              </p>
            )}
          </div>
        )}

        {/* STEP 2 — Tax Method */}
        {step === 2 && (
          <div>
            <h3 className="font-display text-xl font-bold text-slate-800 mb-2">
              Which tax method do you want to use?
            </h3>
            <p className="text-slate-500 text-sm font-body mb-2">
              Don't worry — TaxiPoa will calculate both methods and show you a
              side-by-side comparison so you can pick the one that saves you
              more money.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6">
              <p className="text-blue-700 text-xs font-body">
                <span className="font-semibold">Not sure?</span> Pick Income
                Tax. It works for everyone and TaxiPoa will tell you if TOT
                would save you money.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  value: "income_tax",
                  label: "Individual Income Tax",
                  desc: "Progressive rates 10%–35% on taxable income after deductions. Best for most freelancers and consultants.",
                  tag: "Recommended",
                  tagColor: "bg-green-100 text-green-700",
                  details: [
                    "Claim deductions for expenses (laptop, internet, home office)",
                    "Personal relief of KES 28,800 applied automatically",
                    "Withholding tax certificates credited against your bill",
                  ],
                },
                {
                  value: "turnover_tax",
                  label: "Turnover Tax (TOT)",
                  desc: "1.5% flat rate on gross turnover. Simple calculation — no expense deductions. TaxiPoa will calculate both and recommend the cheaper one.",
                  tag: "KES 1M – 25M earners",
                  tagColor: "bg-slate-100 text-slate-600",
                  details: [
                    "Only available if gross income is between KES 1M and 25M",
                    "No expense deductions — 1.5% on everything you earned",
                    "Good if your expenses are very low",
                  ],
                },
              ].map(({ value, label, desc, tag, tagColor, details }) => {
                const selected = taxType === value;
                return (
                  <button
                    key={value}
                    onClick={() => setTaxType(value)}
                    className={`w-full p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                      selected
                        ? "border-[#1A5276] bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div
                          className={`font-display font-semibold ${
                            selected ? "text-[#1A5276]" : "text-slate-800"
                          }`}
                        >
                          {label}
                        </div>
                        <div className="text-slate-500 text-xs font-body mt-1">
                          {desc}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full font-body ${tagColor}`}
                        >
                          {tag}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selected
                              ? "border-[#1A5276] bg-[#1A5276]"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {details.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-xs text-slate-500 font-body"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                              selected ? "bg-[#1A5276]" : "bg-slate-300"
                            }`}
                          />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-slate-600 text-sm font-body font-medium mb-2">
                Your filing summary:
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-body">Tax year</span>
                  <span className="font-display font-semibold text-slate-800">
                    {selectedYear}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-body">Income types</span>
                  <span className="font-display font-semibold text-slate-800 capitalize">
                    {incomeTypes.length > 0 ? incomeTypes.join(", ") : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-body">Tax method</span>
                  <span className="font-display font-semibold text-slate-800">
                    {taxType === "income_tax" ? "Income Tax" : "Turnover Tax"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() =>
              step === 0 ? navigate("/filings") : setStep((s) => s - 1)
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-display font-medium text-sm transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? "Cancel" : "Back"}
          </button>

          {step < 2 ? (
            <button
              onClick={() => {
                if (step === 1 && incomeTypes.length === 0) {
                  toast.error("Please select at least one income type");
                  return;
                }
                setStep((s) => s + 1);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1A5276] hover:bg-[#154360] text-white font-display font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 cursor-pointer"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E8449] hover:bg-[#196F3D] text-white font-display font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-green-900/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Filing
                  <CircleCheck className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
