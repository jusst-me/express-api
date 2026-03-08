import type { NextFunction, Request, Response } from 'express';

import { NotFoundError, ValidationError } from './errors';
import { error as jsendError, fail as jsendFail } from './jsend';

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
    jsendFail(res, { error: err.message }, 404);
    return;
  }

  if (err instanceof ValidationError) {
    const data: Record<string, unknown> = { error: err.message };
    if (err.details !== undefined) data.details = err.details;
    jsendFail(res, data, 400);
    return;
  }

  logError(req, err);
  const data = req.requestId ? { requestId: req.requestId } : undefined;
  jsendError(res, 'Internal server error', { code: 500, data });
};
