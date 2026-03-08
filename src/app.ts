import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { setupSwagger } from './api/docs/swagger';
import apiRoutes from './api/routes/index';
import { config } from './config/index';
import { errorHandler } from './utils/errorHandler';
import { NotFoundError } from './utils/errors';
import { requestIdMiddleware } from './utils/requestId';

const app = express();

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
  res.json({ message: 'Express API' });
});

setupSwagger(app, '/api-docs');

app.use('/api/v1', apiRoutes);

app.use((_req, _res, next) => {
  next(new NotFoundError('Not Found'));
});

app.use(errorHandler);

export default app;
