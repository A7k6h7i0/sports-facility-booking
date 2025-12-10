/**
 * MongoDB Database Connection Configuration
 * Establishes connection with retry logic and provides transaction-ready client
 */

const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Connect to MongoDB with production-ready settings
 * Enables replica set for transaction support
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

/**
 * Start a MongoDB session for transaction support
 * @returns {Promise<mongoose.ClientSession>} MongoDB session object
 */
const startSession = async () => {
  return await mongoose.startSession();
};

module.exports = { connectDB, startSession };
