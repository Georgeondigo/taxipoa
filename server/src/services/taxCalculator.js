// ─────────────────────────────────────────────────────────────────
// TaxiPoa — KRA Tax Calculation Engine
// Based on Kenya Revenue Authority rates for 2025/2026
// ─────────────────────────────────────────────────────────────────

const PERSONAL_RELIEF = 28800; // KES per year

// ── Income Tax Bands ──────────────────────────────────────────────
const TAX_BANDS = [
  { min: 0,         max: 288000,    rate: 0.10 },
  { min: 288001,    max: 388000,    rate: 0.25 },
  { min: 388001,    max: 6000000,   rate: 0.30 },
  { min: 6000001,   max: 9600000,   rate: 0.325 },
  { min: 9600001,   max: Infinity,  rate: 0.35 },
];

// ── 1. Income Tax Calculation ─────────────────────────────────────
function calculateIncomeTax(grossIncome, totalDeductions = 0, whtCredits = 0) {
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  let tax = 0;
  let remaining = taxableIncome;

  for (const band of TAX_BANDS) {
    if (remaining <= 0) break;

    const bandSize = band.max === Infinity
      ? remaining
      : Math.min(remaining, band.max - band.min + 1);

    const taxableInBand = Math.min(remaining, bandSize);
    tax += taxableInBand * band.rate;
    remaining -= taxableInBand;
  }

  const taxAfterRelief = Math.max(0, tax - PERSONAL_RELIEF);
  const netTaxPayable = Math.max(0, taxAfterRelief - whtCredits);

  return {
    type: 'income_tax',
    grossIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeRelief: Math.round(tax),
    personalRelief: PERSONAL_RELIEF,
    taxAfterRelief: Math.round(taxAfterRelief),
    whtCredits,
    netTaxPayable: Math.round(netTaxPayable),
  };
}

// ── 2. Turnover Tax Calculation ───────────────────────────────────
function calculateTOT(grossTurnover) {
  if (grossTurnover < 1000000) {
    return {
      type: 'turnover_tax',
      eligible: false,
      reason: 'Below KES 1,000,000 threshold — you should file Income Tax instead',
      grossTurnover,
      totPayable: 0,
    };
  }

  if (grossTurnover > 25000000) {
    return {
      type: 'turnover_tax',
      eligible: false,
      reason: 'Above KES 25,000,000 — you must file Income Tax',
      grossTurnover,
      totPayable: 0,
    };
  }

  const totPayable = Math.round(grossTurnover * 0.015);

  return {
    type: 'turnover_tax',
    eligible: true,
    grossTurnover,
    rate: '1.5%',
    totPayable,
  };
}

// ── 3. Recommendation — which tax type saves more money ───────────
function recommendTaxType(grossIncome, totalDeductions = 0, whtCredits = 0) {
  const incomeTaxResult = calculateIncomeTax(grossIncome, totalDeductions, whtCredits);
  const totResult = calculateTOT(grossIncome);

  // TOT not eligible — income tax is the only option
  if (!totResult.eligible) {
    return {
      recommended: 'income_tax',
      reason: totResult.reason,
      incomeTax: incomeTaxResult,
      tot: totResult,
      saving: 0,
    };
  }

  const saving = totResult.totPayable - incomeTaxResult.netTaxPayable;

  if (incomeTaxResult.netTaxPayable <= totResult.totPayable) {
    return {
      recommended: 'income_tax',
      reason: `Income Tax saves you KES ${saving.toLocaleString()} compared to Turnover Tax`,
      incomeTax: incomeTaxResult,
      tot: totResult,
      saving,
    };
  }

  return {
    recommended: 'turnover_tax',
    reason: `Turnover Tax saves you KES ${Math.abs(saving).toLocaleString()} compared to Income Tax`,
    incomeTax: incomeTaxResult,
    tot: totResult,
    saving: Math.abs(saving),
  };
}

// ── 4. Penalty Estimator ──────────────────────────────────────────
function estimatePenalty(taxPayable, monthsLate) {
  if (taxPayable <= 0 || monthsLate <= 0) return 0;

  const fixedPenalty = 2000;
  const percentPenalty = taxPayable * 0.05;
  const latePenalty = Math.max(fixedPenalty, percentPenalty);
  const monthlyInterest = taxPayable * 0.01 * monthsLate;

  return Math.round(latePenalty + monthlyInterest);
}

// ── 5. VAT Threshold Check ────────────────────────────────────────
function checkVATThreshold(grossIncome) {
  const VAT_THRESHOLD = 5000000;
  return {
    mustRegister: grossIncome >= VAT_THRESHOLD,
    threshold: VAT_THRESHOLD,
    message: grossIncome >= VAT_THRESHOLD
      ? 'Your income exceeds KES 5,000,000. You are required to register for VAT.'
      : `You are KES ${(VAT_THRESHOLD - grossIncome).toLocaleString()} below the VAT registration threshold.`
  };
}

module.exports = {
  calculateIncomeTax,
  calculateTOT,
  recommendTaxType,
  estimatePenalty,
  checkVATThreshold,
};