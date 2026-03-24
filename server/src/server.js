const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// load environment variables 
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware -----------------------------------------
app.use(cors({
    origin: 'http://localhost:5173', // vite dev server port
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true
}));

// Routes --------------------------------------------
app.use('/api/auth', authRoutes);


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
