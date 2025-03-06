interface LoggerOptions {
  isProd?: boolean;
  additionalInfo?: Record<string, any>;
}

const defaultOptions: LoggerOptions = {
  isProd: false,
  additionalInfo: {},
};

export const logger = (message: any, options: LoggerOptions = defaultOptions) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isLoggerEnabled = process.env.ENABLE_LOGGER === 'true';
  
  // Return early if logger is disabled
  if (!isLoggerEnabled) {
    return;
  }

  // Don't log in production unless explicitly enabled
  if (isProduction && !options.isProd) {
    return;
  }

  // Get caller file path using Error stack
  const stack = new Error().stack;
  const callerLine = stack?.split('\n')[2]; // First line is Error, second is logger call, third is caller
  const match = callerLine?.match(/\((.*):\d+:\d+\)/);
  const filename = match ? match[1] : 'unknown';

  const timestamp = new Date().toISOString();
  
  const logData = {
    timestamp,
    filename,
    message: typeof message === 'object' ? JSON.stringify(message) : message,
    ...options.additionalInfo
  };

  console.log(JSON.stringify(logData, null, 2));
};
