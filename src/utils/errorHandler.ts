import type { NextFunction, Request, Response } from 'express';

import { ErrorMessages } from '@/constants/errors';
import { HttpStatus } from '@/constants/http';
import { NotFoundError, ValidationError } from '@/utils/errors';
import { error as jsendError, fail as jsendFail } from '@/utils/jsend';

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
    jsendFail(res, { error: err.message }, HttpStatus.NOT_FOUND);
    return;
  }

  if (err instanceof ValidationError) {
    const data: Record<string, unknown> = { error: err.message };
    if (err.details !== undefined) data.details = err.details;
    jsendFail(res, data, HttpStatus.BAD_REQUEST);
    return;
  }

  logError(req, err);
  const data = req.requestId ? { requestId: req.requestId } : undefined;
  jsendError(res, ErrorMessages.INTERNAL_SERVER_ERROR, {
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    data,
  });
};
