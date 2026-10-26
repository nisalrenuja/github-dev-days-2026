type Meta = Record<string, unknown>;

function write(level: 'info' | 'warn' | 'error', message: string, meta?: Meta) {
  if (process.env.NODE_ENV === 'test') return;
  const line = { time: new Date().toISOString(), level, message, ...meta };
  console[level](JSON.stringify(line));
}

export const logger = {
  info: (message: string, meta?: Meta) => write('info', message, meta),
  warn: (message: string, meta?: Meta) => write('warn', message, meta),
  error: (message: string, meta?: Meta) => write('error', message, meta),
};
