import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment configuration loader with validation
 */
const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_db',
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
  },

  // Email
  email: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM,
  },

  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    dir: process.env.LOG_DIR || './logs',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // Encryption
  encryptionKey: process.env.ENCRYPTION_KEY,

  // Redis
  redis: {
    url: process.env.REDIS_URL,
  },

  // Features
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
  },
};

/**
 * Validate required environment variables
 */
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
}

export default config;
