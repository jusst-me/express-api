import request from 'supertest';

import app from '../../app';
import { NON_EXISTENT_ID, SEED_IDS } from '../../test/constants';

describe('USERS /users', () => {
  describe('GET /users', () => {
    it('returns all users', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('email');
    });
  });

  describe('GET /users/:id', () => {
    it('returns a user by id', async () => {
      const res = await request(app).get(`/users/${SEED_IDS.userAlice}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: SEED_IDS.userAlice,
        name: 'Alice Johnson',
        email: 'alice@example.com',
      });
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).get(`/users/${NON_EXISTENT_ID}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /users/:id/posts', () => {
    it('returns posts for a user', async () => {
      const res = await request(app).get(`/users/${SEED_IDS.userAlice}/posts`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every((p: { userId: string }) => p.userId === SEED_IDS.userAlice)).toBe(true);
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).get(`/users/${NON_EXISTENT_ID}/posts`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /users', () => {
    it('creates a new user', async () => {
      const res = await request(app).post('/users').send({
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(res.body).toHaveProperty('id');
    });

    it('returns 400 for invalid body', async () => {
      const res = await request(app).post('/users').send({ name: 'Only name' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /users/:id', () => {
    it('updates a user', async () => {
      const res = await request(app).put(`/users/${SEED_IDS.userCarol}`).send({
        id: SEED_IDS.userCarol,
        name: 'Carol Updated',
        email: 'carol.updated@example.com',
      });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Carol Updated');
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).put(`/users/${NON_EXISTENT_ID}`).send({
        id: NON_EXISTENT_ID,
        name: 'Name',
        email: 'email@example.com',
      });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('deletes a user without posts', async () => {
      const createRes = await request(app).post('/users').send({
        name: 'To Delete',
        email: 'delete@example.com',
      });
      const id = createRes.body.id;

      const deleteRes = await request(app).delete(`/users/${id}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app).get(`/users/${id}`);
      expect(getRes.status).toBe(404);
    });

    it('returns 400 when user has posts', async () => {
      const res = await request(app).delete(`/users/${SEED_IDS.userAlice}`);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).delete(`/users/${NON_EXISTENT_ID}`);
      expect(res.status).toBe(404);
    });
  });
});
