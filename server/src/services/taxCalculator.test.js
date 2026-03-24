const {
  calculateIncomeTax,
  calculateTOT,
  recommendTaxType,
  estimatePenalty,
  checkVATThreshold,
} = require('./taxCalculator');

// ── Income Tax Tests ──────────────────────────────────────────────
describe('calculateIncomeTax', () => {

  test('zero income returns zero tax', () => {
    const result = calculateIncomeTax(0, 0, 0);
    expect(result.netTaxPayable).toBe(0);
  });

  test('income below personal relief threshold pays zero tax', () => {
    // KES 200,000 income, no deductions
    // Tax = 200,000 * 10% = 20,000
    // After relief: 20,000 - 28,800 = 0 (can't go negative)
    const result = calculateIncomeTax(200000, 0, 0);
    expect(result.netTaxPayable).toBe(0);
  });

  test('income of KES 500,000 with no deductions', () => {
    // Band 1: 288,000 * 10% = 28,800
    // Band 2: 100,000 * 25% = 25,000
    // Band 3: 112,000 * 30% = 33,600
    // Total before relief: 87,400
    // After relief: 87,400 - 28,800 = 58,600
    const result = calculateIncomeTax(500000, 0, 0);
    expect(result.taxableIncome).toBe(500000);
    expect(result.netTaxPayable).toBe(58600);
  });

  test('deductions reduce taxable income correctly', () => {
    const withDeductions = calculateIncomeTax(500000, 100000, 0);
    const withoutDeductions = calculateIncomeTax(500000, 0, 0);
    expect(withDeductions.netTaxPayable).toBeLessThan(withoutDeductions.netTaxPayable);
    expect(withDeductions.taxableIncome).toBe(400000);
  });

  test('WHT credits reduce net tax payable', () => {
    const result = calculateIncomeTax(500000, 0, 20000);
    expect(result.netTaxPayable).toBe(38600);
  });

  test('WHT credits cannot make tax go negative', () => {
    const result = calculateIncomeTax(200000, 0, 100000);
    expect(result.netTaxPayable).toBe(0);
  });

});

// ── TOT Tests ─────────────────────────────────────────────────────
describe('calculateTOT', () => {

  test('income below 1M is not eligible for TOT', () => {
    const result = calculateTOT(800000);
    expect(result.eligible).toBe(false);
  });

  test('income above 25M is not eligible for TOT', () => {
    const result = calculateTOT(30000000);
    expect(result.eligible).toBe(false);
  });

  test('KES 2,000,000 turnover gives correct TOT', () => {
    // 2,000,000 * 1.5% = 30,000
    const result = calculateTOT(2000000);
    expect(result.eligible).toBe(true);
    expect(result.totPayable).toBe(30000);
  });

  test('KES 5,000,000 turnover gives correct TOT', () => {
    // 5,000,000 * 1.5% = 75,000
    const result = calculateTOT(5000000);
    expect(result.totPayable).toBe(75000);
  });

});

// ── Recommendation Tests ──────────────────────────────────────────
describe('recommendTaxType', () => {

  test('recommends income tax for low earners (below 1M TOT threshold)', () => {
    const result = recommendTaxType(500000, 0, 0);
    expect(result.recommended).toBe('income_tax');
  });

  test('recommends the cheaper option for eligible earners', () => {
    const result = recommendTaxType(2000000, 0, 0);
    expect(['income_tax', 'turnover_tax']).toContain(result.recommended);
    expect(result.saving).toBeGreaterThanOrEqual(0);
  });

});

// ── Penalty Tests ─────────────────────────────────────────────────
describe('estimatePenalty', () => {

  test('no penalty for on-time filing', () => {
    expect(estimatePenalty(50000, 0)).toBe(0);
  });

  test('minimum penalty is KES 2,000', () => {
    // Tax payable KES 100 — 5% = KES 5, but minimum is KES 2,000
    const result = estimatePenalty(100, 1);
    expect(result).toBeGreaterThanOrEqual(2000);
  });

  test('penalty grows with months late', () => {
    const oneMonth = estimatePenalty(100000, 1);
    const sixMonths = estimatePenalty(100000, 6);
    expect(sixMonths).toBeGreaterThan(oneMonth);
  });

});

// ── VAT Threshold Tests ───────────────────────────────────────────
describe('checkVATThreshold', () => {

  test('below 5M does not require VAT registration', () => {
    const result = checkVATThreshold(3000000);
    expect(result.mustRegister).toBe(false);
  });

  test('above 5M requires VAT registration', () => {
    const result = checkVATThreshold(6000000);
    expect(result.mustRegister).toBe(true);
  });

  test('exactly 5M requires VAT registration', () => {
    const result = checkVATThreshold(5000000);
    expect(result.mustRegister).toBe(true);
  });

});