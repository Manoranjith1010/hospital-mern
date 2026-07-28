import mongoose from 'mongoose';
import config from './env.js';
import logger from '../utils/logger.js';

/**
 * MongoDB connection setup with connection pooling and error handling
 */
const connectDB = async () => {
  try {
    const mongoUri = config.mongodb.uri;

    const connectionOptions = {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority',
    };

    if (config.mongodb.user && config.mongodb.password) {
      connectionOptions.authSource = 'admin';
    }

    await mongoose.connect(mongoUri, connectionOptions);

    logger.info('✓ MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    return mongoose.connection;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('✓ MongoDB disconnected');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error.message);
    process.exit(1);
  }
};

export { connectDB, disconnectDB };
