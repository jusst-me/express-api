import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { setupSwagger } from './api/docs/swagger';
import apiRoutes from './api/routes/index';
import { config } from './config/index';
import { ApiPaths, ROOT_MESSAGE } from './constants/api';
import { ErrorMessages } from './constants/errors';
import { errorHandler } from './utils/errorHandler';
import { NotFoundError } from './utils/errors';
import { success } from './utils/jsend';
import { requestIdMiddleware } from './utils/requestId';

const app = express();

// Trust proxy when behind Railway, Render, etc. – required for correct rate limiting
app.set('trust proxy', 1);

app.use(requestIdMiddleware);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
      },
    },
  })
);
app.use(cors({ origin: config.corsOrigin }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.rateLimitMax,
  })
);
app.use(express.json({ limit: '100kb' }));

app.get('/', (_req, res) => {
  success(res, { message: ROOT_MESSAGE });
});

setupSwagger(app, ApiPaths.DOCS);

app.use(ApiPaths.BASE, apiRoutes);

app.use((_req, _res, next) => {
  next(new NotFoundError(ErrorMessages.NOT_FOUND));
});

app.use(errorHandler);

export default app;
