import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { initializeJobs } from './jobs/index.js';
import config from './config/env.js';
import logger from './utils/logger.js';

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Initialize cron jobs
    initializeJobs();

    // Start listening
    const port = config.port;
    app.listen(port, () => {
      logger.info(`✓ Server running on port ${port}`);
      logger.info(`✓ Environment: ${config.nodeEnv}`);
      logger.info(`✓ API available at http://localhost:${port}/api`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

/**
 * Handle graceful shutdown
 */
process.on('SIGINT', async () => {
  logger.info('Graceful shutdown initiated');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Graceful shutdown initiated (SIGTERM)');
  await disconnectDB();
  process.exit(0);
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

/**
 * Handle unhandled rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
