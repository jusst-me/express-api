import request from 'supertest';

import app from '../../app';
import { API_BASE, NON_EXISTENT_ID, SEED_IDS } from '../../test/constants';

describe('POSTS /posts', () => {
  describe('GET /posts', () => {
    it('returns all posts', async () => {
      const res = await request(app).get(`${API_BASE}/posts`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'success' });
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('title');
      expect(res.body.data[0]).toHaveProperty('body');
      expect(res.body.data[0]).toHaveProperty('userId');
      expect(res.body.data[0]).toHaveProperty('createdAt');
    });
  });

  describe('GET /posts/:id', () => {
    it('returns a post by id', async () => {
      const res = await request(app).get(`${API_BASE}/posts/${SEED_IDS.post1}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 'success',
        data: {
          id: SEED_IDS.post1,
          title: 'Getting Started with Web Development',
          userId: SEED_IDS.userAlice,
        },
      });
    });

    it('returns 404 for non-existent post', async () => {
      const res = await request(app).get(`${API_BASE}/posts/${NON_EXISTENT_ID}`);
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ status: 'fail', data: { error: expect.any(String) } });
    });
  });

  describe('POST /posts', () => {
    it('creates a new post', async () => {
      const res = await request(app).post(`${API_BASE}/posts`).send({
        title: 'Test Post',
        body: 'Test body content',
        userId: SEED_IDS.userAlice,
      });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        status: 'success',
        data: {
          title: 'Test Post',
          body: 'Test body content',
          userId: SEED_IDS.userAlice,
        },
      });
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('createdAt');
    });

    it('returns 400 for invalid body', async () => {
      const res = await request(app).post(`${API_BASE}/posts`).send({ title: 'Only title' });
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ status: 'fail', data: { error: expect.any(String) } });
    });

    it('returns 400 for non-existent userId', async () => {
      const res = await request(app).post(`${API_BASE}/posts`).send({
        title: 'Test',
        body: 'Body',
        userId: NON_EXISTENT_ID,
      });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /posts/:id', () => {
    it('updates a post', async () => {
      const res = await request(app).put(`${API_BASE}/posts/${SEED_IDS.post1}`).send({
        id: SEED_IDS.post1,
        title: 'Updated Title',
        body: 'Updated body',
        userId: SEED_IDS.userAlice,
      });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'success', data: { title: 'Updated Title' } });
    });

    it('returns 404 for non-existent post', async () => {
      const res = await request(app).put(`${API_BASE}/posts/${NON_EXISTENT_ID}`).send({
        id: NON_EXISTENT_ID,
        title: 'Title',
        body: 'Body',
        userId: SEED_IDS.userAlice,
      });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('deletes a post', async () => {
      const createRes = await request(app).post(`${API_BASE}/posts`).send({
        title: 'To Delete',
        body: 'Body',
        userId: SEED_IDS.userAlice,
      });
      const id = createRes.body.data.id;

      const deleteRes = await request(app).delete(`${API_BASE}/posts/${id}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toMatchObject({ status: 'success', data: null });

      const getRes = await request(app).get(`${API_BASE}/posts/${id}`);
      expect(getRes.status).toBe(404);
    });

    it('returns 404 for non-existent post', async () => {
      const res = await request(app).delete(`${API_BASE}/posts/${NON_EXISTENT_ID}`);
      expect(res.status).toBe(404);
    });
  });
});
