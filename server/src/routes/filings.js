const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../prisma');
const authMiddleware = require('../middleware/authMiddleware');
const {
    calculateIncomeTax,
    calculateTOT,
    recommendTaxType,
    checkVATThreshold,
    estimatePenalty,
} = require('../services/taxCalculator');
const { generateTaxSummaryPDF } = require('../services/pdfGenerator');

const router = express.Router();

// All routes in this file require authentication
router.use(authMiddleware);

// ── GET /api/filings — list all filings for current user ─────────────────
router.get('/', authMiddleware, async (req, res) => {
    try {
        const filings = await prisma.taxFiling.findMany({
            where: { userId: req.user.id },
            orderBy: { taxYear: 'desc' },
            include:{
                _count: {
                    select:{
                        incomeEntries: true,
                        expenses: true,
                    }
                }
                    }
            });

            res.json({
                success: true,
                data: { filings },
            });

        } catch (error) {
            console.error('Error fetching filings:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching filings',
            });
        }
            });


// ── POST /api/filings — create a new tax filing for current user ───────────────
router.post('/', authMiddleware, [
    body('taxYear')
        .isInt({ min: 2020, max: new Date().getFullYear() })
        .withMessage('Tax year must be a valid year between 2020 and current year'),
        body('taxType')
        .isIn(['income_tax', 'turnover_tax'])
        .withMessage('Tax type must be either "income_tax" or "turnover_tax"'),
], async (req, res) => {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }

    const { taxYear, taxType } = req.body;

    // Check if filing for the same year already exists
    const existing = await prisma.taxFiling.findFirst({
        where: {
            userId: req.user.id,
            taxYear: parseInt(taxYear),
        }
    });

    if (existing) {
        return res.status(400).json({
            success: false,
            message: `You already have a filing for ${taxYear}.`,
            data: { filing: existing },
        });
    }

    const filing = await prisma.taxFiling.create({
        data: {
            userId: req.user.id,
            taxYear: parseInt(taxYear),
            taxType,
        }
    });

    res.status(201).json({
        success: true,
        message: `Tax filing for ${taxYear} created.`,
        data: { filing }
    });

} catch (error) {
    console.error('Error creating tax filing:', error);
    res.status(500).json({
        success: false,
        message: 'Server error while creating tax filing',
    });
}
});

// ── GET /api/filings/:id — get one filing with all data ──────────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const filing = await prisma.taxFiling.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
            include: {
                incomeEntries: {orderBy: { dateReceived: 'desc' }},
                expenses: {orderBy: { dateIncurred: 'desc' }},
            }
        });

        if (!filing) {
            return res.status(404).json({
                success: false,
                message: 'Tax filing not found',
            });
        }

        res.json({
            success: true,
            data: { filing },
        });

    } catch (error) {
        console.error('Error fetching tax filing:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching tax filing',
        });
    }
});

// ── PATCH /api/filings/:id — update filing status or type ─────────────────────────────────
router.patch('/:id', authMiddleware, [
    body('status')
        .optional()
        .isIn(['draft', 'completed', 'submitted'])
        .withMessage('Invalid status'),
    body('taxType')
        .optional()
        .isIn(['income_tax', 'turnover_tax'])
        .withMessage('Invalid tax type'),
], async (req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }


     // Make sure filing belongs to this user
     const existing = await prisma.taxFiling.findFirst({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!existing) {
        return res.status(404).json({
            success: false,
            message: 'Tax filing not found',
        });
    }

    const { status, taxType } = req.body;

    const updated = await prisma.taxFiling.update({
        where: { id: req.params.id },
        data: {
            ...(status && { status }),
            ...(taxType && { taxType }),
        },
    });

    res.json({
        success: true,
        message: 'Tax filing updated',
        data: { filing: updated },
    });

} catch (error) {
    console.error('Error updating tax filing:', error);
    res.status(500).json({
        success: false,
        message: 'Server error while updating tax filing',
    });
}
});

// ── DELETE /api/filings/:id — delete a draft filing ─────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const existing = await prisma.taxFiling.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Tax filing not found',
            });
        }

        if (existing.status !== 'draft') {
            return res.status(400).json({
                success: false,
                message: 'Only draft filings can be deleted',
            });
        }

        await prisma.taxFiling.delete({
            where: { id: req.params.id },
        });
    } catch (error) {
        console.error('Error deleting tax filing:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting tax filing',
        });
    }
});

// ── GET /api/filings/:id/calculate — run tax calculation ───────
router.get('/:id/calculate', authMiddleware, async (req, res) => {
    try {
        const filing = await prisma.taxFiling.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
            include: {
                incomeEntries: true,
                expenses: true,
            },
        });

        if (!filing) {
            return res.status(404).json({
                success: false,
                message: 'Tax filing not found',
            });
        }

        //sum all income
        const grossIncome = filing.incomeEntries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0);

        // sum all WHT credits
        const whtCredits = filing.incomeEntries.reduce((sum, entry) => sum + parseFloat(entry.whtAmount || 0), 0);

        // sun allowable expenses only 
        const totalDeductions = filing.expenses
            .filter(e => e.isAllowable)
            .reduce((sum, e) => sum + parseFloat(e.amount), 0);

        // Run calculations 
        const recommendation = recommendTaxType(grossIncome, totalDeductions, whtCredits);
        const VatCheck = checkVATThreshold(grossIncome);

        // Calculate penalty if late (filing deadline is June 30)
        const currentYear = new Date().getFullYear();
        const deadline = new Date(`${filing.taxYear + 1}-06-30`);
        const now = new Date();
        const monthsLate = now > deadline
           ? Math.floor((now - deadline) / (1000 * 60 * 60 * 24 * 30))
           : 0;
        
        const penalty = estimatePenalty(
            recommendation.recommended === 'income_tax'
             ? recommendation.incomeTax.netTaxPayable
             : recommendation.tot?.totPayable || 0,
            monthsLate
        );

        // Save the results back to the filing
        const finalTax = recommendation.recommended === 'income_tax'
            ? recommendation.incomeTax
            : recommendation.tot;

        await prisma.taxFiling.update({
            where: { id: filing.id },
            data: {
                totalIncome: grossIncome,
                totalDeductions,
                taxableIncome: recommendation.incomeTax?.taxableIncome || grossIncome,
                taxCalculated: recommendation.incomeTax?.taxAfterRelif || finalTax.totPayable || 0,
                whtCredits,
                netTaxPayable: recommendation.recommended === 'income_tax'
                 ? recommendation.incomeTax.netTaxPayable
                  : recommendation.tot.totPayable,
            },
        });

        res.json({
            success: true,
            data: {
                grossIncome,
                totalDeductions,
                whtCredits,
                recommendation,
                VatCheck,
                penalty:  monthsLate > 0 ? penalty : null,
                summary: {
                    recommended: recommendation.recommended,
                    amountDue: recommendation.recommended === 'income_tax'
                     ? recommendation.incomeTax.netTaxPayable
                     : recommendation.tot?.totPayable,
                    savings: recommendation.savings,
                },
            },
        });

    } catch (error) {
        console.error('Error calculating tax:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while calculating tax',
        });
    }
                }       
        );

 // ── GET /api/filings/:id/pdf — generate tax summary PDF ────────
router.get('/:id/pdf', authMiddleware, async (req, res) => {
  try {
    const filing = await prisma.taxFiling.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        incomeEntries: true,
        expenses: true,
      }
    });

    if (!filing) {
      return res.status(404).json({ success: false, message: 'Filing not found.' });
    }

    if (filing.incomeEntries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one income entry before generating the PDF.'
      });
    }

    const grossIncome = filing.incomeEntries.reduce(
      (sum, e) => sum + parseFloat(e.amount), 0
    );
    const whtCredits = filing.incomeEntries.reduce(
      (sum, e) => sum + parseFloat(e.whtDeducted), 0
    );
    const totalDeductions = filing.expenses
      .filter(e => e.isAllowable)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const { recommendTaxType, checkVATThreshold } = require('../services/taxCalculator');
    const recommendation = recommendTaxType(grossIncome, totalDeductions, whtCredits);
    const vatCheck = checkVATThreshold(grossIncome);

    const calculationResult = {
      grossIncome,
      totalDeductions,
      whtCredits,
      recommendation,
      vatCheck,
    };

    const prismaFull = require('../prisma');
    const user = await prismaFull.user.findUnique({
      where: { id: req.user.id },
      select: { fullName: true, email: true, kraPin: true }
    });

    const { generateTaxSummaryPDF } = require('../services/pdfGenerator');
    const doc = generateTaxSummaryPDF(filing, calculationResult, user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="TaxiPoa-${user.fullName.replace(/\s+/g, '-')}-${filing.taxYear}.pdf"`
    );

    doc.pipe(res);
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, message: 'Could not generate PDF.' });
  }
});


module.exports = router;