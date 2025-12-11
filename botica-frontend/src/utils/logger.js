/**
 * Logger utility for development environment
 * Only logs in development mode, silent in production
 */

const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },

  info: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(...args);
    }
  },

  warn: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },

  error: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(...args);
    }
  }
};

export default logger;
