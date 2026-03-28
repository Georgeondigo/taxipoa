import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  TrendingUp,
  Receipt,
  Calculator,
  Download,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "../api/api";
import toast from "react-hot-toast";

// ── Helpers ────────────────────────────────────────────────────
const formatKES = (amount) =>
  `KES ${Number(amount || 0).toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const INCOME_TYPES = [
  { value: "freelance", label: "Freelance / Consulting" },
  { value: "employment", label: "Employment / Salary" },
  { value: "rental", label: "Rental Income" },
  { value: "business", label: "Business / Trade" },
  { value: "other", label: "Other Income" },
];

const EXPENSE_CATEGORIES = [
  { value: "home_office", label: "Home Office" },
  { value: "equipment", label: "Equipment" },
  { value: "internet", label: "Internet & Phone" },
  { value: "transport", label: "Transport" },
  { value: "software", label: "Software & Subscriptions" },
  { value: "professional", label: "Professional Services" },
  { value: "other", label: "Other" },
];

// ── Tab Button ─────────────────────────────────────────────────
function Tab({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium font-body border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
        active
          ? "border-[#1A5276] text-[#1A5276]"
          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full font-display ${
            active ? "bg-[#1A5276] text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ── Modal wrapper ──────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-display font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Form Field ─────────────────────────────────────────────────
function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 font-body mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-slate-400 text-xs font-body mt-1">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-body text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
const selectClass = `${inputClass} cursor-pointer`;

// ══════════════════════════════════════════════════════════════
export default function FilingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filing, setFiling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [calculation, setCalculation] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Modal states
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  // Income form
  const [incomeForm, setIncomeForm] = useState({
    sourceType: "freelance",
    clientName: "",
    amount: "",
    dateReceived: "",
    whtDeducted: "",
    notes: "",
  });

  // Expense form
  const [expenseForm, setExpenseForm] = useState({
    category: "software",
    description: "",
    amount: "",
    dateIncurred: "",
    isAllowable: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFiling();
  }, [id]);

  const fetchFiling = async () => {
    try {
      const res = await api.get(`/api/filings/${id}`);
      setFiling(res.data.data.filing);
    } catch {
      toast.error("Could not load filing");
      navigate("/filings");
    } finally {
      setLoading(false);
    }
  };

  const runCalculation = async () => {
    setCalculating(true);
    try {
      const res = await api.get(`/api/filings/${id}/calculate`);
      setCalculation(res.data.data);
      setActiveTab("results");
      toast.success("Tax calculated!");
    } catch {
      toast.error("Could not calculate tax");
    } finally {
      setCalculating(false);
    }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/api/filings/${id}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `TaxiPoa-${filing.taxYear}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Could not generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  // ── Income CRUD ────────────────────────────────────────────
  const openAddIncome = () => {
    setEditingIncome(null);
    setIncomeForm({
      sourceType: "freelance",
      clientName: "",
      amount: "",
      dateReceived: "",
      whtDeducted: "",
      notes: "",
    });
    setShowIncomeModal(true);
  };

  const openEditIncome = (entry) => {
    setEditingIncome(entry);
    setIncomeForm({
      sourceType: entry.sourceType,
      clientName: entry.clientName || "",
      amount: String(entry.amount),
      dateReceived: entry.dateReceived?.split("T")[0] || "",
      whtDeducted: String(entry.whtDeducted || 0),
      notes: entry.notes || "",
    });
    setShowIncomeModal(true);
  };

  const saveIncome = async () => {
    if (!incomeForm.amount || !incomeForm.dateReceived) {
      toast.error("Amount and date are required");
      return;
    }
    setSaving(true);
    try {
      if (editingIncome) {
        await api.patch(`/api/income/${editingIncome.id}`, {
          ...incomeForm,
          amount: parseFloat(incomeForm.amount),
          whtDeducted: parseFloat(incomeForm.whtDeducted || 0),
        });
        toast.success("Income updated");
      } else {
        await api.post("/api/income", {
          ...incomeForm,
          filingId: id,
          amount: parseFloat(incomeForm.amount),
          whtDeducted: parseFloat(incomeForm.whtDeducted || 0),
        });
        toast.success("Income added");
      }
      setShowIncomeModal(false);
      fetchFiling();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save income");
    } finally {
      setSaving(false);
    }
  };

  const deleteIncome = async (entryId) => {
    if (!confirm("Delete this income entry?")) return;
    try {
      await api.delete(`/api/income/${entryId}`);
      toast.success("Income entry deleted");
      fetchFiling();
    } catch {
      toast.error("Could not delete");
    }
  };

  // ── Expense CRUD ───────────────────────────────────────────
  const openAddExpense = () => {
    setEditingExpense(null);
    setExpenseForm({
      category: "software",
      description: "",
      amount: "",
      dateIncurred: "",
      isAllowable: true,
    });
    setShowExpenseModal(true);
  };

  const openEditExpense = (exp) => {
    setEditingExpense(exp);
    setExpenseForm({
      category: exp.category,
      description: exp.description,
      amount: String(exp.amount),
      dateIncurred: exp.dateIncurred?.split("T")[0] || "",
      isAllowable: exp.isAllowable,
    });
    setShowExpenseModal(true);
  };

  const saveExpense = async () => {
    if (
      !expenseForm.description ||
      !expenseForm.amount ||
      !expenseForm.dateIncurred
    ) {
      toast.error("Description, amount and date are required");
      return;
    }
    setSaving(true);
    try {
      if (editingExpense) {
        await api.patch(`/api/expenses/${editingExpense.id}`, {
          ...expenseForm,
          amount: parseFloat(expenseForm.amount),
        });
        toast.success("Expense updated");
      } else {
        await api.post("/api/expenses", {
          ...expenseForm,
          filingId: id,
          amount: parseFloat(expenseForm.amount),
        });
        toast.success("Expense added");
      }
      setShowExpenseModal(false);
      fetchFiling();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save expense");
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (expId) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await api.delete(`/api/expenses/${expId}`);
      toast.success("Expense deleted");
      fetchFiling();
    } catch {
      toast.error("Could not delete");
    }
  };

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-[#1A5276] rounded-full animate-spin" />
      </div>
    );
  }

  if (!filing) return null;

  const totalIncome =
    filing.incomeEntries?.reduce((sum, e) => sum + parseFloat(e.amount), 0) ||
    0;
  const totalWHT =
    filing.incomeEntries?.reduce(
      (sum, e) => sum + parseFloat(e.whtDeducted || 0),
      0,
    ) || 0;
  const totalExpenses =
    filing.expenses
      ?.filter((e) => e.isAllowable)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/filings")}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-body transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            All filings
          </button>
          <h2 className="font-display text-2xl font-bold text-slate-800">
            Tax Year {filing.taxYear}
          </h2>
          <p className="text-slate-500 text-sm font-body mt-0.5">
            {filing.taxType === "income_tax"
              ? "Individual Income Tax"
              : "Turnover Tax (TOT)"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Calculate button */}
          <button
            onClick={runCalculation}
            disabled={calculating || filing.incomeEntries?.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1A5276] hover:bg-[#154360] text-white font-display font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 cursor-pointer"
          >
            {calculating ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Calculator className="w-4 h-4" />
            )}
            {calculating ? "Calculating..." : "Calculate Tax"}
          </button>

          {/* Download PDF */}
          <button
            onClick={downloadPDF}
            disabled={downloading || filing.incomeEntries?.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 font-display font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
          >
            {downloading ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            PDF
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Total Income",
            value: formatKES(totalIncome),
            color: "text-blue-700",
            bg: "bg-blue-50",
          },
          {
            label: "Deductions",
            value: formatKES(totalExpenses),
            color: "text-green-700",
            bg: "bg-green-50",
          },
          {
            label: "WHT Credits",
            value: formatKES(totalWHT),
            color: "text-orange-700",
            bg: "bg-orange-50",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-2xl p-4 border border-white`}
          >
            <div className={`font-display text-xl font-bold ${card.color}`}>
              {card.value}
            </div>
            <div className="text-slate-500 text-xs font-body mt-1">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto px-2 scrollbar-hide">
          <Tab
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <Tab
            label="Income"
            active={activeTab === "income"}
            onClick={() => setActiveTab("income")}
            count={filing.incomeEntries?.length}
          />
          <Tab
            label="Expenses"
            active={activeTab === "expenses"}
            onClick={() => setActiveTab("expenses")}
            count={filing.expenses?.length}
          />
          <Tab
            label="Results"
            active={activeTab === "results"}
            onClick={() => setActiveTab("results")}
          />
        </div>

        <div className="p-6">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Tax Year", value: filing.taxYear },
                  {
                    label: "Tax Type",
                    value:
                      filing.taxType === "income_tax"
                        ? "Individual Income Tax"
                        : "Turnover Tax",
                  },
                  {
                    label: "Status",
                    value:
                      filing.status.charAt(0).toUpperCase() +
                      filing.status.slice(1),
                  },
                  {
                    label: "Income Entries",
                    value: filing.incomeEntries?.length || 0,
                  },
                  { label: "Expenses", value: filing.expenses?.length || 0 },
                  {
                    label: "Net Tax Payable",
                    value: formatKES(filing.netTaxPayable),
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-3 border-b border-slate-50"
                  >
                    <span className="text-slate-500 text-sm font-body">
                      {label}
                    </span>
                    <span className="font-display font-semibold text-slate-800 text-sm">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Next steps guide */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-display font-semibold text-slate-700 text-sm mb-3">
                  How to complete this filing:
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      step: 1,
                      label: "Add all income you received",
                      done: (filing.incomeEntries?.length || 0) > 0,
                      tab: "income",
                    },
                    {
                      step: 2,
                      label: "Add your deductible expenses",
                      done: (filing.expenses?.length || 0) > 0,
                      tab: "expenses",
                    },
                    {
                      step: 3,
                      label: "Calculate your best tax option",
                      done: !!calculation,
                      tab: null,
                    },
                    {
                      step: 4,
                      label: "Download your iTax reference summary",
                      done: false,
                      tab: null,
                    },
                  ].map(({ step, label, done, tab }) => (
                    <div
                      key={step}
                      onClick={() => tab && setActiveTab(tab)}
                      className={`flex items-center gap-3 ${tab ? "cursor-pointer hover:opacity-80" : ""}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-display font-bold ${
                          done
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {done ? "✓" : step}
                      </div>
                      <span
                        className={`text-sm font-body ${done ? "text-green-700 line-through" : "text-slate-600"}`}
                      >
                        {label}
                      </span>
                      {tab && !done && (
                        <span className="text-[#2E86C1] text-xs font-body ml-auto">
                          Go →
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── INCOME TAB ── */}
          {activeTab === "income" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-slate-800">
                    Income Entries
                  </h3>
                  <p className="text-slate-400 text-xs font-body mt-0.5">
                    Add every payment you received in {filing.taxYear}
                  </p>
                </div>
                <button
                  onClick={openAddIncome}
                  className="flex items-center gap-2 px-3 py-2 bg-[#1A5276] text-white text-sm font-display font-semibold rounded-xl hover:bg-[#154360] transition-all duration-200 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Income
                </button>
              </div>

              {filing.incomeEntries?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="font-display font-semibold text-slate-600 text-sm mb-1">
                    No income entries yet
                  </p>
                  <p className="text-slate-400 text-xs font-body mb-4">
                    Add every payment you received from clients, salary, or
                    other sources
                  </p>
                  <button
                    onClick={openAddIncome}
                    className="text-[#2E86C1] text-sm font-medium font-body hover:underline cursor-pointer"
                  >
                    + Add your first income entry
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filing.incomeEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-display font-semibold text-slate-800 text-sm break-words">
                                {entry.clientName || entry.sourceType}
                              </div>
                              <div className="text-slate-400 text-xs font-body mt-0.5 break-words">
                                {
                                  INCOME_TYPES.find(
                                    (t) => t.value === entry.sourceType,
                                  )?.label
                                }
                                {" · "}
                                {new Date(
                                  entry.dateReceived,
                                ).toLocaleDateString("en-KE", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                                {parseFloat(entry.whtDeducted) > 0 && (
                                  <> · WHT: {formatKES(entry.whtDeducted)}</>
                                )}
                              </div>
                            </div>

                            <div className="sm:text-right">
                              <div className="font-display font-bold text-slate-800 text-sm">
                                {formatKES(entry.amount)}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-1 mt-3 sm:mt-2 sm:justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditIncome(entry)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteIncome(entry.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="font-display font-semibold text-blue-800 text-sm">
                      Total Income
                    </span>
                    <span className="font-display font-bold text-blue-800">
                      {formatKES(totalIncome)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── EXPENSES TAB ── */}
          {activeTab === "expenses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-slate-800">
                    Deductible Expenses
                  </h3>
                  <p className="text-slate-400 text-xs font-body mt-0.5">
                    Work-related expenses reduce your taxable income
                  </p>
                </div>
                <button
                  onClick={openAddExpense}
                  className="flex items-center gap-2 px-3 py-2 bg-[#1E8449] text-white text-sm font-display font-semibold rounded-xl hover:bg-[#196F3D] transition-all duration-200 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </button>
              </div>

              {/* Info banner */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700 text-xs font-body">
                  Only allowable expenses reduce your tax. Personal expenses
                  (groceries, clothes, entertainment) are not deductible.
                </p>
              </div>

              {filing.expenses?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="font-display font-semibold text-slate-600 text-sm mb-1">
                    No expenses yet
                  </p>
                  <p className="text-slate-400 text-xs font-body mb-4">
                    Add work-related expenses to reduce what you owe
                  </p>
                  <button
                    onClick={openAddExpense}
                    className="text-[#2E86C1] text-sm font-medium font-body hover:underline cursor-pointer"
                  >
                    + Add your first expense
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filing.expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className={`p-4 rounded-xl transition-colors group ${
                        exp.isAllowable
                          ? "bg-slate-50 hover:bg-green-50"
                          : "bg-red-50/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            exp.isAllowable ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <Receipt
                            className={`w-4 h-4 ${exp.isAllowable ? "text-green-600" : "text-red-400"}`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-display font-semibold text-slate-800 text-sm break-words">
                                {exp.description}
                              </div>
                              <div className="text-slate-400 text-xs font-body mt-0.5 break-words">
                                {
                                  EXPENSE_CATEGORIES.find(
                                    (c) => c.value === exp.category,
                                  )?.label
                                }
                                {" · "}
                                {new Date(exp.dateIncurred).toLocaleDateString(
                                  "en-KE",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                                {!exp.isAllowable && " · Not deductible"}
                              </div>
                            </div>

                            <div className="font-display font-bold text-slate-800 text-sm sm:text-right">
                              {formatKES(exp.amount)}
                            </div>
                          </div>

                          <div className="flex gap-1 mt-3 sm:mt-2 sm:justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditExpense(exp)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteExpense(exp.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                    <span className="font-display font-semibold text-green-800 text-sm">
                      Total Deductions
                    </span>
                    <span className="font-display font-bold text-green-800">
                      {formatKES(totalExpenses)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── RESULTS TAB ── */}
          {activeTab === "results" && (
            <div className="space-y-5">
              {!calculation ? (
                <div className="text-center py-12">
                  <Calculator className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-display font-semibold text-slate-600 mb-1">
                    No calculation yet
                  </p>
                  <p className="text-slate-400 text-sm font-body mb-4">
                    Add your income first, then run the tax calculator
                  </p>
                  <button
                    onClick={runCalculation}
                    disabled={filing.incomeEntries?.length === 0}
                    className="bg-[#1A5276] text-white font-display font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-[#154360] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Calculate Tax Now
                  </button>
                </div>
              ) : (
                <>
                  {/* Recommendation banner */}
                  <div
                    className={`rounded-xl p-5 border ${
                      calculation.recommendation?.recommended === "income_tax"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          calculation.recommendation?.recommended ===
                          "income_tax"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-display font-semibold text-sm ${
                            calculation.recommendation?.recommended ===
                            "income_tax"
                              ? "text-blue-800"
                              : "text-green-800"
                          }`}
                        >
                          Recommended:{" "}
                          {calculation.recommendation?.recommended ===
                          "income_tax"
                            ? "Individual Income Tax"
                            : "Turnover Tax (TOT)"}
                        </p>
                        <p
                          className={`text-xs font-body mt-1 ${
                            calculation.recommendation?.recommended ===
                            "income_tax"
                              ? "text-blue-700"
                              : "text-green-700"
                          }`}
                        >
                          {calculation.recommendation?.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-2">
                    {[
                      {
                        label: "Gross Income",
                        value: formatKES(calculation.grossIncome),
                        highlight: false,
                      },
                      {
                        label: "Less: Allowable Deductions",
                        value: `(${formatKES(calculation.totalDeductions)})`,
                        highlight: false,
                      },
                      {
                        label: "Taxable Income",
                        value: formatKES(
                          calculation.recommendation?.incomeTax?.taxableIncome,
                        ),
                        highlight: true,
                      },
                      {
                        label: "Income Tax (before relief)",
                        value: formatKES(
                          calculation.recommendation?.incomeTax
                            ?.taxBeforeRelief,
                        ),
                        highlight: false,
                      },
                      {
                        label: "Less: Personal Relief",
                        value: "(KES 28,800)",
                        highlight: false,
                      },
                      {
                        label: "Tax After Relief",
                        value: formatKES(
                          calculation.recommendation?.incomeTax?.taxAfterRelief,
                        ),
                        highlight: true,
                      },
                      {
                        label: "Less: WHT Credits",
                        value: `(${formatKES(calculation.whtCredits)})`,
                        highlight: false,
                      },
                    ].map(({ label, value, highlight }) => (
                      <div
                        key={label}
                        className={`flex justify-between items-center px-4 py-3 rounded-lg ${
                          highlight ? "bg-blue-50" : "bg-slate-50"
                        }`}
                      >
                        <span
                          className={`text-sm font-body ${highlight ? "text-blue-700 font-medium" : "text-slate-600"}`}
                        >
                          {label}
                        </span>
                        <span
                          className={`text-sm font-display font-semibold ${highlight ? "text-blue-800" : "text-slate-800"}`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Net Tax Payable */}
                  <div
                    className={`rounded-xl p-5 text-center ${
                      calculation.recommendation?.incomeTax?.netTaxPayable === 0
                        ? "bg-green-500"
                        : calculation.recommendation?.incomeTax?.netTaxPayable >
                            100000
                          ? "bg-red-500"
                          : "bg-[#1A5276]"
                    }`}
                  >
                    <p className="text-white/80 text-xs font-body uppercase tracking-wide mb-1">
                      Net Tax Payable to KRA
                    </p>
                    <p className="font-display text-3xl font-bold text-white">
                      {formatKES(
                        calculation.recommendation?.incomeTax?.netTaxPayable,
                      )}
                    </p>
                    {calculation.recommendation?.incomeTax?.netTaxPayable ===
                      0 && (
                      <p className="text-green-100 text-xs font-body mt-1">
                        No tax due — your WHT credits cover your full liability
                      </p>
                    )}
                  </div>

                  {/* VAT warning */}
                  {calculation.vatCheck?.mustRegister && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-display font-semibold text-red-800 text-sm">
                          VAT Registration Required
                        </p>
                        <p className="text-red-700 text-xs font-body mt-1">
                          {calculation.vatCheck.message}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* How to pay */}
                  <div className="bg-slate-50 rounded-xl p-5">
                    <h4 className="font-display font-semibold text-slate-700 text-sm mb-3">
                      How to file using this summary
                    </h4>
                    <div className="space-y-2">
                      {[
                        "Log in to itax.kra.go.ke using your KRA PIN and password",
                        "Go to Returns → File Return → Individual Income Tax Return",
                        "Use the figures from your TaxiPoa summary to fill in each field",
                        "Submit your return and note your Payment Registration Number (PRN)",
                        "Pay via M-Pesa: Paybill 222222, Account = your PRN number",
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-[#1A5276] text-white rounded-full flex items-center justify-center text-xs font-display font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-slate-600 text-sm font-body">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <button
                        onClick={downloadPDF}
                        disabled={downloading}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:border-[#2E86C1] text-slate-700 font-display font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        {downloading
                          ? "Generating..."
                          : "Download iTax Reference Summary (PDF)"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Income Modal ── */}
      {showIncomeModal && (
        <Modal
          title={editingIncome ? "Edit Income Entry" : "Add Income Entry"}
          onClose={() => setShowIncomeModal(false)}
        >
          <div className="space-y-4">
            <Field label="Income Type" required>
              <select
                value={incomeForm.sourceType}
                onChange={(e) =>
                  setIncomeForm({ ...incomeForm, sourceType: e.target.value })
                }
                className={selectClass}
              >
                {INCOME_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Client / Source Name"
              hint="e.g. Safaricom PLC, My Employer Ltd"
            >
              <input
                type="text"
                value={incomeForm.clientName}
                onChange={(e) =>
                  setIncomeForm({ ...incomeForm, clientName: e.target.value })
                }
                placeholder="Client or employer name"
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Amount (KES)" required>
                <input
                  type="number"
                  value={incomeForm.amount}
                  onChange={(e) =>
                    setIncomeForm({ ...incomeForm, amount: e.target.value })
                  }
                  placeholder="0"
                  min="0"
                  className={inputClass}
                />
              </Field>
              <Field label="WHT Deducted" hint="Leave 0 if none">
                <input
                  type="number"
                  value={incomeForm.whtDeducted}
                  onChange={(e) =>
                    setIncomeForm({
                      ...incomeForm,
                      whtDeducted: e.target.value,
                    })
                  }
                  placeholder="0"
                  min="0"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Date Received" required>
              <input
                type="date"
                value={incomeForm.dateReceived}
                onChange={(e) =>
                  setIncomeForm({ ...incomeForm, dateReceived: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Notes">
              <input
                type="text"
                value={incomeForm.notes}
                onChange={(e) =>
                  setIncomeForm({ ...incomeForm, notes: e.target.value })
                }
                placeholder="Optional note"
                className={inputClass}
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowIncomeModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-display font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveIncome}
                disabled={saving}
                className="flex-1 py-2.5 bg-[#1A5276] text-white font-display font-semibold text-sm rounded-xl hover:bg-[#154360] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Saving..." : editingIncome ? "Update" : "Add Income"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Expense Modal ── */}
      {showExpenseModal && (
        <Modal
          title={editingExpense ? "Edit Expense" : "Add Expense"}
          onClose={() => setShowExpenseModal(false)}
        >
          <div className="space-y-4">
            <Field label="Category" required>
              <select
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, category: e.target.value })
                }
                className={selectClass}
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Description"
              required
              hint="e.g. Adobe Creative Cloud subscription"
            >
              <input
                type="text"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    description: e.target.value,
                  })
                }
                placeholder="What was this expense for?"
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Amount (KES)" required>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                  }
                  placeholder="0"
                  min="0"
                  className={inputClass}
                />
              </Field>
              <Field label="Date" required>
                <input
                  type="date"
                  value={expenseForm.dateIncurred}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      dateIncurred: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                id="allowable"
                checked={expenseForm.isAllowable}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    isAllowable: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
              <label
                htmlFor="allowable"
                className="text-sm font-body text-slate-700 cursor-pointer"
              >
                This is a KRA-allowable business expense
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowExpenseModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-display font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveExpense}
                disabled={saving}
                className="flex-1 py-2.5 bg-[#1E8449] text-white font-display font-semibold text-sm rounded-xl hover:bg-[#196F3D] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {saving
                  ? "Saving..."
                  : editingExpense
                    ? "Update"
                    : "Add Expense"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
