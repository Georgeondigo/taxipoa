const PDFDocument = require('pdfkit');

// ── Helpers ────────────────────────────────────────────────────
function formatKES(amount) {
  return `KES ${Number(amount).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-KE', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

// ── Main PDF generator ─────────────────────────────────────────
function generateTaxSummaryPDF(filing, calculationResult, user) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 60, right: 60 }
  });

  const PRIMARY   = '#1A5276';
  const ACCENT    = '#2E86C1';
  const GREEN     = '#1E8449';
  const ORANGE    = '#CA6F1E';
  const RED       = '#C0392B';
  const LIGHTGRAY = '#F2F3F4';
  const DARKGRAY  = '#2C3E50';
  const WHITE     = '#FFFFFF';
  const pageWidth = 595 - 120; // A4 width minus margins

  // ── HEADER ──────────────────────────────────────────────────
  // Background bar
  doc.rect(0, 0, 595, 90).fill(PRIMARY);

  // App name
  doc.fillColor(WHITE)
     .font('Helvetica-Bold')
     .fontSize(24)
     .text('TaxiPoa', 60, 22);

  // Tagline
  doc.fillColor('#AED6F1')
     .font('Helvetica')
     .fontSize(10)
     .text('KRA Tax Filing Assistant — Kenya', 60, 52);

  // Document title on right
  doc.fillColor(WHITE)
     .font('Helvetica-Bold')
     .fontSize(13)
     .text('TAX SUMMARY REPORT', 60, 22, { align: 'right' });

  doc.fillColor('#AED6F1')
     .font('Helvetica')
     .fontSize(9)
     .text(`Generated: ${formatDate(new Date())}`, 60, 42, { align: 'right' });

  doc.moveDown(3);

  // ── TAXPAYER INFO ────────────────────────────────────────────
  doc.fillColor(PRIMARY)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('TAXPAYER INFORMATION', 60, 110);

  doc.moveTo(60, 125).lineTo(535, 125).strokeColor(ACCENT).lineWidth(1.5).stroke();

  doc.moveDown(0.5);

  const infoY = 135;
  doc.fillColor(DARKGRAY).font('Helvetica').fontSize(10);

  doc.font('Helvetica-Bold').text('Full Name:', 60, infoY)
     .font('Helvetica').text(user.fullName, 160, infoY);

  doc.font('Helvetica-Bold').text('Email:', 60, infoY + 18)
     .font('Helvetica').text(user.email, 160, infoY + 18);

  doc.font('Helvetica-Bold').text('KRA PIN:', 60, infoY + 36)
     .font('Helvetica').text(user.kraPin || 'Not provided', 160, infoY + 36);

  doc.font('Helvetica-Bold').text('Tax Year:', 320, infoY)
     .font('Helvetica').text(String(filing.taxYear), 420, infoY);

  doc.font('Helvetica-Bold').text('Tax Type:', 320, infoY + 18)
     .font('Helvetica').text(
       filing.taxType === 'income_tax' ? 'Individual Income Tax' : 'Turnover Tax (TOT)',
       420, infoY + 18
     );

  doc.font('Helvetica-Bold').text('Status:', 320, infoY + 36)
     .font('Helvetica').text(filing.status.toUpperCase(), 420, infoY + 36);

  // ── INCOME SUMMARY ───────────────────────────────────────────
  doc.moveDown(2.5);
  const incomeY = doc.y;

  doc.fillColor(PRIMARY)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('INCOME SUMMARY', 60, incomeY);

  doc.moveTo(60, incomeY + 15).lineTo(535, incomeY + 15)
     .strokeColor(ACCENT).lineWidth(1.5).stroke();

  // Table header
  const tableTop = incomeY + 25;
  doc.rect(60, tableTop, pageWidth, 22).fill(PRIMARY);

  doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(9);
  doc.text('CLIENT / SOURCE', 68, tableTop + 7);
  doc.text('TYPE', 240, tableTop + 7);
  doc.text('DATE', 320, tableTop + 7);
  doc.text('WHT', 400, tableTop + 7);
  doc.text('AMOUNT', 460, tableTop + 7);

  // Table rows
  let rowY = tableTop + 22;
  filing.incomeEntries.forEach((entry, i) => {
    const fill = i % 2 === 0 ? WHITE : '#EBF5FB';
    doc.rect(60, rowY, pageWidth, 20).fill(fill);

    doc.fillColor(DARKGRAY).font('Helvetica').fontSize(9);
    doc.text(entry.clientName || '—', 68, rowY + 6, { width: 155 });
    doc.text(entry.sourceType.replace('_', ' '), 240, rowY + 6);
    doc.text(formatDate(entry.dateReceived), 320, rowY + 6);
    doc.text(formatKES(entry.whtDeducted), 395, rowY + 6);
    doc.text(formatKES(entry.amount), 455, rowY + 6);

    rowY += 20;
  });

  // Total row
  doc.rect(60, rowY, pageWidth, 22).fill('#D6EAF8');
  doc.fillColor(PRIMARY).font('Helvetica-Bold').fontSize(9);
  doc.text('TOTAL INCOME', 68, rowY + 7);
  doc.text(formatKES(calculationResult.grossIncome), 455, rowY + 7);

  rowY += 22;

  // ── EXPENSES SUMMARY ─────────────────────────────────────────
  doc.moveDown(1);
  const expY = rowY + 20;

  doc.fillColor(PRIMARY)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('DEDUCTIBLE EXPENSES', 60, expY);

  doc.moveTo(60, expY + 15).lineTo(535, expY + 15)
     .strokeColor(ACCENT).lineWidth(1.5).stroke();

  // Table header
  const expTableTop = expY + 25;
  doc.rect(60, expTableTop, pageWidth, 22).fill(PRIMARY);

  doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(9);
  doc.text('DESCRIPTION', 68, expTableTop + 7);
  doc.text('CATEGORY', 280, expTableTop + 7);
  doc.text('DATE', 370, expTableTop + 7);
  doc.text('AMOUNT', 460, expTableTop + 7);

  let expRowY = expTableTop + 22;
  const allowableExpenses = filing.expenses.filter(e => e.isAllowable);

  allowableExpenses.forEach((exp, i) => {
    const fill = i % 2 === 0 ? WHITE : '#EAFAF1';
    doc.rect(60, expRowY, pageWidth, 20).fill(fill);

    doc.fillColor(DARKGRAY).font('Helvetica').fontSize(9);
    doc.text(exp.description, 68, expRowY + 6, { width: 205 });
    doc.text(exp.category.replace('_', ' '), 280, expRowY + 6);
    doc.text(formatDate(exp.dateIncurred), 370, expRowY + 6);
    doc.text(formatKES(exp.amount), 455, expRowY + 6);

    expRowY += 20;
  });

  // Total deductions row
  doc.rect(60, expRowY, pageWidth, 22).fill('#D5F5E3');
  doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(9);
  doc.text('TOTAL DEDUCTIONS', 68, expRowY + 7);
  doc.text(formatKES(calculationResult.totalDeductions), 455, expRowY + 7);

  expRowY += 22;

  // ── TAX CALCULATION BREAKDOWN ────────────────────────────────
  doc.addPage();

  doc.rect(0, 0, 595, 6).fill(ACCENT);

  doc.fillColor(PRIMARY)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('TAX CALCULATION BREAKDOWN', 60, 30);

  doc.moveTo(60, 45).lineTo(535, 45)
     .strokeColor(ACCENT).lineWidth(1.5).stroke();

  const calcData = calculationResult.recommendation;
  const incomeTax = calcData.incomeTax;

  // Calculation table
  const calcRows = [
    ['Gross Income', formatKES(calculationResult.grossIncome), false],
    ['Less: Allowable Deductions', `(${formatKES(calculationResult.totalDeductions)})`, false],
    ['Taxable Income', formatKES(incomeTax.taxableIncome), true],
    ['', '', false],
    ['Income Tax on Taxable Income', formatKES(incomeTax.taxBeforeRelief), false],
    ['Less: Personal Relief', `(${formatKES(incomeTax.personalRelief)})`, false],
    ['Tax After Personal Relief', formatKES(incomeTax.taxAfterRelief), true],
    ['Less: WHT Credits', `(${formatKES(calculationResult.whtCredits)})`, false],
  ];

  let calcY = 60;
  calcRows.forEach(([label, value, highlight]) => {
    if (!label) { calcY += 8; return; }

    if (highlight) {
      doc.rect(60, calcY - 2, pageWidth, 20).fill('#EBF5FB');
    }

    doc.fillColor(highlight ? PRIMARY : DARKGRAY)
       .font(highlight ? 'Helvetica-Bold' : 'Helvetica')
       .fontSize(10)
       .text(label, 68, calcY);

    doc.fillColor(highlight ? PRIMARY : DARKGRAY)
       .font(highlight ? 'Helvetica-Bold' : 'Helvetica')
       .text(value, 60, calcY, { align: 'right' });

    doc.moveTo(60, calcY + 16).lineTo(535, calcY + 16)
       .strokeColor('#E5E7E9').lineWidth(0.5).stroke();

    calcY += 22;
  });

  // NET TAX PAYABLE — big box
  calcY += 10;
  const netTax = incomeTax.netTaxPayable;
  const boxColor = netTax === 0 ? GREEN : (netTax > 100000 ? RED : ORANGE);

  doc.rect(60, calcY, pageWidth, 50).fill(boxColor);
  doc.fillColor(WHITE)
     .font('Helvetica-Bold')
     .fontSize(13)
     .text('NET TAX PAYABLE TO KRA', 68, calcY + 10);

  doc.fillColor(WHITE)
     .font('Helvetica-Bold')
     .fontSize(18)
     .text(formatKES(netTax), 60, calcY + 10, { align: 'right' });

  if (netTax === 0) {
    doc.fillColor('#ABEBC6')
       .font('Helvetica')
       .fontSize(9)
       .text('No tax due — WHT credits cover your full liability', 68, calcY + 33);
  }

  calcY += 70;

  // ── RECOMMENDATION BOX ───────────────────────────────────────
  if (calcData.recommended) {
    doc.rect(60, calcY, pageWidth, 60).fill('#EBF5FB')
       .rect(60, calcY, 4, 60).fill(ACCENT);

    doc.fillColor(PRIMARY)
       .font('Helvetica-Bold')
       .fontSize(10)
       .text('RECOMMENDATION', 72, calcY + 10);

    doc.fillColor(DARKGRAY)
       .font('Helvetica')
       .fontSize(9)
       .text(calcData.reason, 72, calcY + 26, { width: pageWidth - 20 });

    if (calcData.saving > 0) {
      doc.fillColor(GREEN)
         .font('Helvetica-Bold')
         .fontSize(9)
         .text(`You save: ${formatKES(calcData.saving)}`, 72, calcY + 44);
    }

    calcY += 78;
  }

  // ── VAT WARNING ──────────────────────────────────────────────
  if (calculationResult.vatCheck?.mustRegister) {
    doc.rect(60, calcY, pageWidth, 45).fill('#FDEDEC')
       .rect(60, calcY, 4, 45).fill(RED);

    doc.fillColor(RED)
       .font('Helvetica-Bold')
       .fontSize(10)
       .text('  VAT REGISTRATION REQUIRED', 72, calcY + 8);

    doc.fillColor(DARKGRAY)
       .font('Helvetica')
       .fontSize(9)
       .text(calculationResult.vatCheck.message, 72, calcY + 24, { width: pageWidth - 20 });

    calcY += 63;
  }

  // ── HOW TO PAY ───────────────────────────────────────────────
  calcY += 10;
  doc.fillColor(PRIMARY)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('HOW TO PAY YOUR TAX', 60, calcY);

  doc.moveTo(60, calcY + 15).lineTo(535, calcY + 15)
     .strokeColor(ACCENT).lineWidth(1.5).stroke();

  calcY += 25;
  const steps = [
    '1. Log in to itax.kra.go.ke using your KRA PIN and password',
    '2. Go to Returns → File Return → Individual Income Tax Return',
    '3. Select the tax year and enter the figures from this summary',
    '4. Submit the return and note your Payment Registration Number (PRN)',
    '5. Pay via M-Pesa: Paybill 222222, Account = your PRN number',
    `6. Amount to pay: ${formatKES(netTax)}`,
  ];

  steps.forEach((step, i) => {
    doc.fillColor(i === 5 ? GREEN : DARKGRAY)
       .font(i === 5 ? 'Helvetica-Bold' : 'Helvetica')
       .fontSize(9)
       .text(step, 68, calcY);
    calcY += 18;
  });

  // ── DEADLINE WARNING ─────────────────────────────────────────
  calcY += 10;
  const deadline = new Date(`${filing.taxYear + 1}-06-30`);
  const daysLeft = Math.floor((deadline - new Date()) / (1000 * 60 * 60 * 24));
  const deadlineColor = daysLeft < 30 ? RED : (daysLeft < 60 ? ORANGE : GREEN);

  doc.rect(60, calcY, pageWidth, 35).fill(deadlineColor);
  doc.fillColor(WHITE)
     .font('Helvetica-Bold')
     .fontSize(10)
     .text(
       daysLeft > 0
         ? `  Filing Deadline: 30 June ${filing.taxYear + 1}  —  ${daysLeft} days remaining`
         : `  Filing Deadline PASSED: 30 June ${filing.taxYear + 1}  —  Penalties may apply`,
       68, calcY + 12
     );

  // ── FOOTER ───────────────────────────────────────────────────
  const footerY = doc.page.height - 50;
  doc.moveTo(60, footerY).lineTo(535, footerY)
     .strokeColor('#BDC3C7').lineWidth(0.5).stroke();

  doc.fillColor('#7F8C8D')
     .font('Helvetica')
     .fontSize(8)
     .text(
       'This document is generated by TaxiPoa for reference purposes only. ' +
       'Verify all figures with a qualified tax advisor before filing. ' +
       'TaxiPoa is not liable for errors in self-reported data.',
       60, footerY + 8,
       { width: pageWidth, align: 'center' }
     );

  return doc;
}

module.exports = { generateTaxSummaryPDF };