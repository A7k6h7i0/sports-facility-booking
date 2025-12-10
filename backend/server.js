/**
 * Express Server Entry Point
 * Production-ready sports facility booking system backend
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courtRoutes = require('./routes/courtRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const coachRoutes = require('./routes/coachRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();

// CORS Configuration - Production ready
// CORS Configuration - Production ready with multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://sports-facility-booking.vercel.app',
  'https://sports-facility-booking-git-main-akhila-gantas-projects.vercel.app'
];

// Add environment variable origins
if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim());
  allowedOrigins.push(...envOrigins);
}

// Also allow any Vercel preview deployments
const isVercelPreview = (origin) => {
  return origin && (
    origin.includes('.vercel.app') || 
    origin.includes('akhila-gantas-projects.vercel.app')
  );
};

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or is a Vercel deployment
    if (allowedOrigins.includes(origin) || isVercelPreview(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware - Only in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Root route - API documentation
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🏟️ Sports Facility Booking API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    documentation: {
      health: '/health',
      endpoints: {
        auth: '/api/auth',
        courts: '/api/courts',
        equipment: '/api/equipment',
        coaches: '/api/coaches',
        pricing: '/api/pricing',
        bookings: '/api/bookings',
        admin: '/api/admin'
      }
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening - Bind to 0.0.0.0 for production deployment
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('\n🚀 ========================================');
      console.log(`   Sports Facility Booking API`);
      console.log(`   Server running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Database: Connected`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`   Local URL: http://localhost:${PORT}`);
      }
      console.log('   ========================================\n');
    });

    // Graceful shutdown handler
    const gracefulShutdown = () => {
      console.log('\n👋 Received shutdown signal. Closing server gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

startServer();
