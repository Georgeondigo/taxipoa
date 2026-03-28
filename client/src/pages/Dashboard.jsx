import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import toast from "react-hot-toast";
import {
  FileText,
  CheckCircle,
  PenLine,
  Clock,
  Plus,
  Settings,
  User,
  Lightbulb,
  CircleCheck,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilings();
  }, []);

  const fetchFilings = async () => {
    try {
      const res = await api.get("/api/filings");
      setFilings(res.data.data.filings);
    } catch (err) {
      toast.error("Could not load your filings");
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const deadline = new Date(`${currentYear}-06-30`);
  const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
  const hasCurrentYearFiling = filings.some(
    (f) => f.taxYear === currentYear - 1,
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-[#1A5276] to-[#2E86C1] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-body mb-1">Welcome back,</p>
          <h2 className="font-display text-2xl font-bold mb-4">
            {user?.fullName?.split(" ")[0]}
          </h2>

          {!hasCurrentYearFiling ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <p className="text-blue-100 font-body text-sm mb-1">
                  You haven't prepared your {currentYear - 1} tax return yet.
                </p>
                <p className="text-blue-200/70 text-xs font-body">
                  Calculate your liability and get your iTax reference summary
                  before June 30.
                </p>
              </div>
              <button
                onClick={() => navigate("/filings/new")}
                className="flex-shrink-0 bg-white text-[#1A5276] font-display font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg cursor-pointer"
              >
                Prepare my return →
              </button>
            </div>
          ) : (
            <p className="text-blue-100 font-body text-sm">
              Your {currentYear - 1} tax preparation is in progress. Keep going!
            </p>
          )}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Filings",
            value: filings.length,
            icon: (
              <svg
                className="w-5 h-5 text-[#1A5276]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            ),
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Completed",
            value: filings.filter((f) => f.status === "completed").length,
            icon: <CircleCheck className="w-5 h-5" />,
            color: "bg-green-50 text-green-700",
          },
          {
            label: "Drafts",
            value: filings.filter((f) => f.status === "draft").length,
            icon: <PenLine className="w-5 h-5" />,
            color: "bg-orange-50 text-orange-700",
          },
          {
            label: "Days to Deadline",
            value: daysLeft > 0 ? daysLeft : "Overdue",
            icon: <Clock className="w-5 h-5" />,
            color:
              daysLeft <= 30
                ? "bg-red-50 text-red-700"
                : "bg-slate-50 text-slate-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
            >
              {stat.icon}
            </div>
            <div className="font-display text-2xl font-bold text-slate-800">
              {stat.value}
            </div>
            <div className="text-slate-500 text-xs font-body mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/filings/new")}
          className="bg-white border-2 border-dashed border-slate-200 hover:border-[#2E86C1] hover:bg-blue-50 rounded-2xl p-5 text-left transition-all duration-200 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#1A5276] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div className="font-display font-semibold text-slate-800 text-sm mb-1">
            New Filing
          </div>
          <div className="text-slate-500 text-xs font-body">
            Start a new tax year return
          </div>
        </button>

        <Link
          to="/filings"
          className="bg-white border border-slate-100 hover:border-[#2E86C1] hover:bg-blue-50 rounded-2xl p-5 text-left transition-all duration-200 group shadow-sm"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
            <svg
              className="w-5 h-5 text-[#1A5276]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="font-display font-semibold text-slate-800 text-sm mb-1">
            View Filings
          </div>
          <div className="text-slate-500 text-xs font-body">
            See all your tax returns
          </div>
        </Link>

        <Link
          to="/settings"
          className="bg-white border border-slate-100 hover:border-[#2E86C1] hover:bg-blue-50 rounded-2xl p-5 text-left transition-all duration-200 group shadow-sm"
        >
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
            <svg
              className="w-5 h-5 text-green-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="font-display font-semibold text-slate-800 text-sm mb-1">
            Your Profile
          </div>
          <div className="text-slate-500 text-xs font-body">
            Add KRA PIN, update details
          </div>
        </Link>
      </div>

      {/* ── Recent Filings ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-display font-semibold text-slate-800">
            Your Filings
          </h3>
          <button
            onClick={() => navigate("/filings/new")}
            className="text-[#2E86C1] text-sm font-medium font-body hover:text-[#1A5276] transition-colors cursor-pointer"
          >
            + New filing
          </button>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-[#1A5276] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-body">
              Loading your filings...
            </p>
          </div>
        ) : filings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="font-display font-semibold text-slate-700 mb-1">
              No filings yet
            </p>
            <p className="text-slate-400 text-sm font-body mb-4">
              Start your first tax filing to get your KRA summary
            </p>
            <button
              onClick={() => navigate("/filings/new")}
              className="bg-[#1A5276] text-white font-display font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-[#154360] transition-all duration-200 cursor-pointer"
            >
              Start first filing
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filings.map((filing) => (
              <FilingRow key={filing.id} filing={filing} />
            ))}
          </div>
        )}
      </div>

      {/* ── KRA Tips ── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex gap-4">
          <div className="text-2xl flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-amber-900 text-sm mb-1">
              KRA Filing Tip
            </h4>
            <p className="text-amber-800 text-sm font-body">
              Keep receipts for work-related expenses such as laptop costs,
              internet, transport, and software subscriptions. Recording your
              income and potentially allowable expenses in TaxiPoa helps
              generate a clearer tax estimate and filing summary. Before
              submitting, review the details carefully and use the summary as a
              guide when filing directly on{" "}
              <span className="font-semibold">itax.kra.go.ke</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Filing Row Component ───────────────────────────────────────
function FilingRow({ filing }) {
  const navigate = useNavigate();

  const statusConfig = {
    draft: {
      label: "Draft",
      class: "bg-orange-50 text-orange-700 border-orange-200",
    },
    completed: {
      label: "Completed",
      class: "bg-green-50 text-green-700 border-green-200",
    },
    submitted: {
      label: "Submitted",
      class: "bg-blue-50 text-blue-700 border-blue-200",
    },
  };

  const status = statusConfig[filing.status] || statusConfig.draft;

  return (
    <div
      onClick={() => navigate(`/filings/${filing.id}`)}
      className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 group-hover:bg-[#1A5276] rounded-xl flex items-center justify-center transition-colors duration-200">
          <svg
            className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <div className="font-display font-semibold text-slate-800 text-sm">
            Tax Year {filing.taxYear}
          </div>
          <div className="text-slate-400 text-xs font-body mt-0.5">
            {filing.taxType === "income_tax"
              ? "Individual Income Tax"
              : "Turnover Tax (TOT)"}
            {" · "}
            {filing._count?.incomeEntries || 0} income entries
            {" · "}
            {filing._count?.expenses || 0} expenses
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {filing.netTaxPayable > 0 && (
          <div className="text-right hidden sm:block">
            <div className="font-display font-bold text-slate-800 text-sm">
              KES {Number(filing.netTaxPayable).toLocaleString()}
            </div>
            <div className="text-slate-400 text-xs font-body">tax payable</div>
          </div>
        )}
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border font-body ${status.class}`}
        >
          {status.label}
        </span>
        <svg
          className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}
