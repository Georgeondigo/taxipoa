const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../prisma');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes in this file require authentication
router.use(authMiddleware);

// ── Helper: verify filing belongs to user ────────────────────────────────────────────────────
async function getUserFiling(filingId, userId ) {
    return prisma.taxFiling.findFirst({
        where: {
            id: filingId,
            userId,
        },
    });
}

// ── POST /api/income — create a new income entry for a tax filing ───────────────────────
router.post('/', authMiddleware, [
  body('filingId').notEmpty().withMessage('Filing ID is required'),
  body('sourceType')
    .isIn(['freelance', 'employment', 'rental', 'business', 'other'])
    .withMessage('Invalid source type'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('dateReceived')
    .isISO8601()
    .withMessage('Date must be a valid date (YYYY-MM-DD)'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { filingId, sourceType, clientName, amount, dateReceived, whtDeducted, notes } = req.body;

    // Verify the filing belongs to the authenticated user
    const filing = await getUserFiling(filingId, req.user.id);
    if (!filing) {
      return res.status(404).json({
        success: false,
        message: 'Tax filing not found'
      });
    }

    const entry = await prisma.incomeEntry.create({
      data: {
        filingId,
        sourceType,
        clientName: clientName || null,
        amount: parseFloat(amount),
        dateReceived: new Date(dateReceived),
        whtDeducted: whtDeducted ? parseFloat(whtDeducted) : 0,
        notes: notes || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Income entry added',
      data: {entry}
    });

  } catch (error) {
    console.error('Error adding income entry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ── PATCH /api/income/:id — edit income entry ──────────────────
router.patch('/:id', authMiddleware, [
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('dateReceived').optional().isISO8601().withMessage(' Invalid date'),
], async (req, res) => { 
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
        }

        // Verify entry exists and belongs to user's filing
        const entry = await prisma.incomeEntry.findUnique({
            where: { id: req.params.id },
            include: { filing: true },
        });

        if (!entry || entry.filing.userId !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Income entry not found' });
        }

        const { sourceType, clientName, amount, dateReceived, whtDeducted, notes } = req.body;

        const updated = await prisma.incomeEntry.update({
            where: { id: req.params.id },
            data: {
                ...(sourceType && { sourceType }),
                ...(clientName !== undefined && { clientName }),
                ...(amount && { amount: parseFloat(amount) }),
                ...(dateReceived && { dateReceived: new Date(dateReceived) }),
                ...(whtDeducted !== undefined && { whtDeducted: parseFloat(whtDeducted) }),
                ...(notes !== undefined && { notes }),
            },
        });

        res.json({
             success: true,
             message: 'Income entry updated',
             data: { entry: updated }
            });

        } catch (error) { 
            console.error('error updating income:', error);
            res.status(500).json({ 
                sucesss: false,
                message: 'Internal server error.'
            });
        }
    });

// ── DELETE /api/income/:id — delete income entry ───────────────
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const entry = await prisma.incomeEntry.findFirst({
            where: { id: req.params.id },
            include: { filing: true }
        });

        if (!entry || entry.filing.userId !== req.user.id) {
            return res.status(404).json({ 
                sucesss: false,
                message: 'Income entry not found.'
            });
        }
        await prisma.incomeEntry.delete({
             where:{
                id: req.params.id
             }
            });

        res.json({ sucesss:true, message: 'Income entry deleted'})

    }catch (error) {
        console.error('Error deleting Income entry.');
        res.status(500).json({ sucess: false, message: 'Internal server error.'});
    }
});

module.exports = router;