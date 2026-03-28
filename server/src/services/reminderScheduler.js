const cron = require('node-cron');
const prisma = require('../prisma');
const { sendDeadlineReminder } = require('./smsService');

// ── Calculate days until June 30 ──────────────────────────────
function getDaysUntilDeadline() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const deadline = new Date(`${currentYear}-06-30`);
  const diffMs = deadline - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// ── Send reminders to all users with phone numbers ─────────────
async function sendScheduledReminders(daysLeft) {
  console.log(`Running reminder job — ${daysLeft} days to deadline`);

  try {
    // Get all users who have a phone number
    const users = await prisma.user.findMany({
      where: {
        phone: { not: null },
      },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
      }
    });

    console.log(`Found ${users.length} users with phone numbers`);

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      const result = await sendDeadlineReminder(user, daysLeft);

      // Log to reminders table
      await prisma.reminder.create({
        data: {
          userId: user.id,
          type: 'sms',
          triggerDate: new Date(),
          message: `${daysLeft}-day deadline reminder`,
          sentAt: result.success ? new Date() : null,
          status: result.success ? 'sent' : 'failed',
        }
      });

      if (result.success) {
        sent++
      } else {
        failed++
      }
    }

    console.log(`Reminder job complete — sent: ${sent}, failed: ${failed}`);

  } catch (error) {
    console.error('Reminder scheduler error:', error);
  }
}

// ── Schedule the cron job ──────────────────────────────────────
// Runs every day at 8:00 AM Nairobi time (UTC+3 = 5:00 AM UTC)
function startReminderScheduler() {
  cron.schedule('0 5 * * *', async () => {
    const daysLeft = getDaysUntilDeadline();

    console.log(`Daily cron running — ${daysLeft} days to June 30 deadline`);

    // Only send on the key reminder days
    if ([30, 7, 1].includes(daysLeft)) {
      await sendScheduledReminders(daysLeft);
    }
  });

  console.log('✅ Reminder scheduler started — runs daily at 8AM Nairobi time');
}

// ── Manual trigger for testing ─────────────────────────────────
async function triggerTestReminder(userId, daysLeft = 7) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, phone: true, email: true }
  });

  if (!user) return { success: false, error: 'User not found' };
  if (!user.phone) return { success: false, error: 'User has no phone number' };

  return sendDeadlineReminder(user, daysLeft);
}

module.exports = { startReminderScheduler, triggerTestReminder, getDaysUntilDeadline };