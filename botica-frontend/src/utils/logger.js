/**
 * Logger utility for development environment
 * Only logs in development mode, silent in production
 */

const isDev = process.env.NODE_ENV === 'development';

const logger = {
  log: (...args) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  info: (...args) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },
  warn: (...args) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  }
};

export default logger;
