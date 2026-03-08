import type { NextFunction, Request, Response } from 'express';

import { NotFoundError, ValidationError } from './errors';

const isDevelopment = process.env.NODE_ENV !== 'production';

const logError = (req: Request, err: Error): void => {
  const payload: Record<string, unknown> = {
    level: 'error',
    requestId: req.requestId,
    message: err.message,
    name: err.name,
  };
  if (isDevelopment && err.stack) {
    payload.stack = err.stack;
  }
  console.error(JSON.stringify(payload));
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err instanceof ValidationError) {
    res
      .status(400)
      .json(
        err.details !== undefined
          ? { error: err.message, details: err.details }
          : { error: err.message }
      );
    return;
  }

  logError(req, err);
  const body: { error: string; requestId?: string } = {
    error: 'Internal server error',
  };
  if (req.requestId) {
    body.requestId = req.requestId;
  }
  res.status(500).json(body);
};
