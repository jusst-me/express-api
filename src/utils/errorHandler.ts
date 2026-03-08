import type { NextFunction, Request, Response } from 'express';

import { NotFoundError, ValidationError } from './errors';

export const errorHandler = (
  err: Error,
  _req: Request,
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

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
