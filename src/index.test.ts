import request from 'supertest';

import app from './app';
import { ApiPaths, ROOT_MESSAGE } from './constants/api';
import { HttpStatus } from './constants/http';
import { JSendStatus } from './constants/jsend';

describe('app smoke test', () => {
  it('responds with JSend success on root', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toMatchObject({
      status: JSendStatus.SUCCESS,
      data: { message: ROOT_MESSAGE },
    });
  });

  it('returns 404 with JSend fail for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
    expect(res.body).toMatchObject({
      status: JSendStatus.FAIL,
      data: { error: expect.any(String) },
    });
  });

  it('serves API docs at /api-docs', async () => {
    const res = await request(app).get(`${ApiPaths.DOCS}/`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.text).toContain('Swagger UI');
  });
});
