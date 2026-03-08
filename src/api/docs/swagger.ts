/* eslint-disable n/no-sync */
import type { Express } from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';

import { config } from '@/config/index';

const loadSpec = (): Record<string, unknown> => {
  const filePath = path.join(process.cwd(), 'src', 'api', 'docs', 'openapi.yaml');
  const content = fs.readFileSync(filePath, 'utf-8');
  const spec = yaml.parse(content) as Record<string, unknown>;
  spec.servers = [{ url: config.apiServerUrl, description: 'API server' }];
  return spec;
};

export const setupSwagger = (app: Express, basePath: string): void => {
  const spec = loadSpec();
  app.use(basePath, swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
};
