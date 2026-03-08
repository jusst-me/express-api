import request from 'supertest';

import app from './app';

describe('app smoke test', () => {
  it('responds with JSend success on root', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'success',
      data: { message: 'Express API' },
    });
  });

  it('returns 404 with JSend fail for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ status: 'fail', data: { error: expect.any(String) } });
  });

  it('serves API docs at /api-docs', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Swagger UI');
  });
});
