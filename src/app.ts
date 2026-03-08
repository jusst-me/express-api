import express from 'express';

import { setupSwagger } from './api/docs/swagger';
import apiRoutes from './api/routes/index';
import { errorHandler } from './utils/errorHandler';
import { NotFoundError } from './utils/errors';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Express API' });
});

setupSwagger(app, '/api-docs');

app.use(apiRoutes);

app.use((_req, _res, next) => {
  next(new NotFoundError('Not Found'));
});

app.use(errorHandler);

export default app;
