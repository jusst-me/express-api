/* eslint-disable n/no-sync */
import type { Express } from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';

const loadSpec = (): Record<string, unknown> => {
  const filePath = path.join(process.cwd(), 'src', 'api', 'docs', 'openapi.yaml');
  const content = fs.readFileSync(filePath, 'utf-8');
  return yaml.parse(content) as Record<string, unknown>;
};

export const setupSwagger = (app: Express, basePath: string): void => {
  const spec = loadSpec();
  app.use(basePath, swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
};
