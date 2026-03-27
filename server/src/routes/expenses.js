const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../prisma');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const VALID_CATEGORIES = [
  'home_office', 'equipment', 'internet',
  'transport', 'software', 'professional', 'other'
];

// ── POST /api/expenses ─────────────────────────────────────────
router.post('/', authMiddleware, [
  body('filingId').notEmpty().withMessage('Filing ID is required'),
  body('category').isIn(VALID_CATEGORIES).withMessage('Invalid category'),
  body('description').notEmpty().withMessage('Description is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('dateIncurred').isISO8601().withMessage('Date must be valid (YYYY-MM-DD)'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { filingId, category, description, amount, dateIncurred, receiptUrl, isAllowable } = req.body;

    const filing = await prisma.taxFiling.findFirst({
      where: { id: filingId, userId: req.user.id }
    });

    if (!filing) {
      return res.status(404).json({ success: false, message: 'Filing not found.' });
    }

    const expense = await prisma.expense.create({
      data: {
        filingId,
        category,
        description,
        amount: parseFloat(amount),
        dateIncurred: new Date(dateIncurred),
        receiptUrl: receiptUrl || null,
        isAllowable: isAllowable !== undefined ? isAllowable : true,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Expense added.',
      data: { expense }
    });

  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

// ── PATCH /api/expenses/:id ────────────────────────────────────
router.patch('/:id', authMiddleware, [
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('category').optional().isIn(VALID_CATEGORIES).withMessage('Invalid category'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const expense = await prisma.expense.findFirst({
      where: { id: req.params.id },
      include: { filing: true }
    });

    if (!expense || expense.filing.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    const { category, description, amount, dateIncurred, receiptUrl, isAllowable } = req.body;

    const updated = await prisma.expense.update({
      where: { id: req.params.id },
      data: {
        ...(category && { category }),
        ...(description && { description }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(dateIncurred && { dateIncurred: new Date(dateIncurred) }),
        ...(receiptUrl !== undefined && { receiptUrl }),
        ...(isAllowable !== undefined && { isAllowable }),
      }
    });

    res.json({
      success: true,
      message: 'Expense updated.',
      data: { expense: updated }
    });

  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

// ── DELETE /api/expenses/:id ───────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await prisma.expense.findFirst({
      where: { id: req.params.id },
      include: { filing: true }
    });

    if (!expense || expense.filing.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    await prisma.expense.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Expense deleted.' });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

module.exports = router;