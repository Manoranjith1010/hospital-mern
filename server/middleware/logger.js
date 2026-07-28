import morgan from 'morgan';
import logger from '../utils/logger.js';

/**
 * Custom Morgan stream for logging to Winston
 */
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

/**
 * Morgan middleware for HTTP request logging
 */
export const httpLogger = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
  { stream: morganStream },
);

/**
 * Custom request logging middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};
