const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// load environment variables 
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

// Middleware -----------------------------------------
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://taxipoa.vercel.app',
    'https://taxipoa-production.up.railway.app',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true
}));
// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true
}));

// Routes --------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/filings', filingsRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/reminders', remindersRoutes);


// Health check endpoint -------------------------------
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: "TaxiPoa API is running",
        timestamp: new Date().toISOString()
    });
});

// 404 handler --------------------------------------
app.use((req, res) => { 
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`,
    });
});

// Global error handler --------------------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// Start the server ----------------------------------
app.listen(PORT, () => {
    console.log(`TaxiPoa server is running on http://localhost:${PORT}`);
});
