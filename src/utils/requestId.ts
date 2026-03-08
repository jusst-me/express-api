import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';

/** Middleware that adds requestId to each request for tracing */
export const requestIdMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers['x-request-id'];
  req.requestId = typeof header === 'string' ? header : crypto.randomUUID();
  next();
};
