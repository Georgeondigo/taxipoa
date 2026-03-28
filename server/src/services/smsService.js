const AfricasTalking = require('africastalking');

// Initialise Africa's Talking
const AT = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = AT.SMS;

// ── Send a single SMS ──────────────────────────────────────────
async function sendSMS(phone, message) {
  try {
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    const result = await sms.send({
      to: [formattedPhone],
      message,
    });

    console.log(`SMS sent to ${formattedPhone}:`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`SMS failed to ${phone}:`, error);
    return { success: false, error: error.message };
  }
}

// ── Send deadline reminder SMS ─────────────────────────────────
async function sendDeadlineReminder(user, daysLeft) {
  const firstName = user.fullName?.split(' ')[0] || 'there';
  const taxYear = new Date().getFullYear() - 1;

  const messages = {
    30: `Hi ${firstName}, your KRA tax return for ${taxYear} is due in 30 days on June 30. TaxiPoa helps you calculate your tax and prepare a simple summary to guide you when filing on iTax. Visit taxipoa.co.ke`,

    7: `Reminder: your KRA tax return for ${taxYear} is due in 7 days on June 30. Use TaxiPoa to review your tax estimate and get a clear summary to help you fill your return on iTax. taxipoa.co.ke`,

    1: `Urgent: the KRA tax return deadline is tomorrow, June 30. TaxiPoa can help you confirm what to fill, estimate your tax, and review your summary before submitting on iTax. Log in at taxipoa.co.ke. File directly on itax.kra.go.ke`,
  };

  const message = messages[daysLeft];
  if (!message) return { success: false, error: 'No message for this days value' };
  if (!user.phone) return { success: false, error: 'User has no phone number' };

  return sendSMS(user.phone, message);
}

module.exports = { sendSMS, sendDeadlineReminder };