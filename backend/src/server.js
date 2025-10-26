require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(logger);

// API Routes
app.use('/api/freelancers', require('./routes/freelancerRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Freelancer Analytics API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      freelancers: '/api/freelancers',
      analytics: '/api/freelancers/analytics',
      reactivate: '/api/freelancers/reactivate',
      countries: '/api/freelancers/filters/countries',
      skills: '/api/freelancers/filters/skills'
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   - Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   - Freelancers: http://localhost:${PORT}/api/freelancers`);
  console.log(`   - Analytics: http://localhost:${PORT}/api/freelancers/analytics`);
  console.log('========================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
