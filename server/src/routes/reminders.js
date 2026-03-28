const express = require('express');
const prisma = require('../prisma');
const authMiddleware = require('../middleware/authMiddleware');
const { triggerTestReminder, getDaysUntilDeadline } = require('../services/reminderScheduler');

const router = express.Router();

// ── POST /api/reminders/test — send yourself a test SMS ────────
router.post('/test', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, fullName: true, phone: true }
    });

    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please add a phone number in Settings before testing SMS.'
      });
    }

    const result = await triggerTestReminder(user.id, 7);

    if (result.success) {
      res.json({
        success: true,
        message: `Test SMS sent to ${user.phone}`
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'SMS failed to send. Check your Africa\'s Talking credentials.'
      });
    }

  } catch (error) {
    console.error('Test reminder error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

// ── GET /api/reminders/deadline — get days until deadline ──────
router.get('/deadline', authMiddleware, (req, res) => {
  const daysLeft = getDaysUntilDeadline();
  const deadline = new Date(`${new Date().getFullYear()}-06-30`);

  res.json({
    success: true,
    data: {
      daysLeft,
      deadline: deadline.toISOString().split('T')[0],
      isOverdue: daysLeft < 0,
      isUrgent: daysLeft <= 14,
    }
  });
});

// ── GET /api/reminders — get user's reminder history ──────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ success: true, data: { reminders } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

module.exports = router;