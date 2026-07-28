import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import 'express-async-errors';
import config from './config/env.js';
import apiRoutes from './routes/index.js';
import { httpLogger, requestLogger } from './middleware/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

/**
 * Initialize Express app
 */
const app = express();

/**
 * Middleware setup
 */

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// CORS middleware
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Logging middleware
app.use(httpLogger);
app.use(requestLogger);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API routes
 */
app.use('/api', apiRoutes);

/**
 * 404 handler
 */
app.use(notFound);

/**
 * Error handling middleware (must be last)
 */
app.use(errorHandler);

export default app;
