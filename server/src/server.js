const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const filingsRoutes = require('./routes/filings');
const incomeRoutes = require('./routes/income');
const expensesRoutes = require('./routes/expenses');
const remindersRoutes = require('./routes/reminders');

// Import scheduler
const { startReminderScheduler } = require('./services/reminderScheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://taxipoa.vercel.app',
  'https://taxipoa-production.up.railway.app',
  process.env.CLIENT_URL,
].filter(Boolean);

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server / health checks / curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaxiPoa API is running',
    timestamp: new Date().toISOString(),
  });
});

// Optional root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to TaxiPoa API',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/filings', filingsRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/reminders', remindersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TaxiPoa server is running on port ${PORT}`);
  console.log(`Health check available at /health`);

  if (typeof startReminderScheduler === 'function') {
    startReminderScheduler();
    console.log('Reminder scheduler started');
  }
});