import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});

export default logger;

// Convenience methods
export const log = {
  info: (msg: string, data?: object) => logger.info(data, msg),
  error: (msg: string, error?: Error | object) => {
    if (error instanceof Error) {
      logger.error({ err: error }, msg);
    } else {
      logger.error(error, msg);
    }
  },
  warn: (msg: string, data?: object) => logger.warn(data, msg),
  debug: (msg: string, data?: object) => logger.debug(data, msg),
};
