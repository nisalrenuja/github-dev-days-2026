import type { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

function isJsonParseError(err: unknown): boolean {
  return err instanceof SyntaxError && (err as { type?: string }).type === 'entity.parse.failed';
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.status).json({ code: err.code, message: err.message });
    return;
  }
  if (isJsonParseError(err)) {
    res.status(400).json({ code: 'INVALID_JSON', message: 'Request body must be valid JSON' });
    return;
  }
  logger.error('Unhandled error', { error: String(err) });
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Something went wrong' });
}
