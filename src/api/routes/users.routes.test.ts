import request from 'supertest';

import app from '../../app';
import { API_BASE, NON_EXISTENT_ID, SEED_IDS } from '../../test/constants';

describe('USERS /users', () => {
  describe('GET /users', () => {
    it('returns all users', async () => {
      const res = await request(app).get(`${API_BASE}/users`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'success' });
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('email');
    });
  });

  describe('GET /users/:id', () => {
    it('returns a user by id', async () => {
      const res = await request(app).get(`${API_BASE}/users/${SEED_IDS.userAlice}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 'success',
        data: {
          id: SEED_IDS.userAlice,
          name: 'Alice Johnson',
          email: 'alice@example.com',
        },
      });
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).get(`${API_BASE}/users/${NON_EXISTENT_ID}`);
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ status: 'fail', data: { error: expect.any(String) } });
    });
  });

  describe('GET /users/:id/posts', () => {
    it('returns posts for a user', async () => {
      const res = await request(app).get(`${API_BASE}/users/${SEED_IDS.userAlice}/posts`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'success' });
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.every((p: { userId: string }) => p.userId === SEED_IDS.userAlice)).toBe(
        true
      );
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).get(`${API_BASE}/users/${NON_EXISTENT_ID}/posts`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /users', () => {
    it('creates a new user', async () => {
      const res = await request(app).post(`${API_BASE}/users`).send({
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        status: 'success',
        data: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });
      expect(res.body.data).toHaveProperty('id');
    });

    it('returns 400 for invalid body', async () => {
      const res = await request(app).post(`${API_BASE}/users`).send({ name: 'Only name' });
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ status: 'fail', data: { error: expect.any(String) } });
    });

    it('returns 400 for invalid email format', async () => {
      const res = await request(app).post(`${API_BASE}/users`).send({
        name: 'Test',
        email: 'not-an-email',
      });
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
      expect(res.body.data.error).toContain('Invalid email');
    });
  });

  describe('PUT /users/:id', () => {
    it('updates a user', async () => {
      const res = await request(app).put(`${API_BASE}/users/${SEED_IDS.userCarol}`).send({
        id: SEED_IDS.userCarol,
        name: 'Carol Updated',
        email: 'carol.updated@example.com',
      });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'success', data: { name: 'Carol Updated' } });
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).put(`${API_BASE}/users/${NON_EXISTENT_ID}`).send({
        id: NON_EXISTENT_ID,
        name: 'Name',
        email: 'email@example.com',
      });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('deletes a user without posts', async () => {
      const createRes = await request(app).post(`${API_BASE}/users`).send({
        name: 'To Delete',
        email: 'delete@example.com',
      });
      const id = createRes.body.data.id;

      const deleteRes = await request(app).delete(`${API_BASE}/users/${id}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toMatchObject({ status: 'success', data: null });

      const getRes = await request(app).get(`${API_BASE}/users/${id}`);
      expect(getRes.status).toBe(404);
    });

    it('returns 400 when user has posts', async () => {
      const res = await request(app).delete(`${API_BASE}/users/${SEED_IDS.userAlice}`);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ status: 'fail', data: { error: expect.any(String) } });
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).delete(`${API_BASE}/users/${NON_EXISTENT_ID}`);
      expect(res.status).toBe(404);
    });
  });
});
