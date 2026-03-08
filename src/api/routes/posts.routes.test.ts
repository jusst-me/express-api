import request from 'supertest';

import app from '../../app';
import { NON_EXISTENT_ID, SEED_IDS } from '../../test/constants';

describe('POSTS /posts', () => {
  describe('GET /posts', () => {
    it('returns all posts', async () => {
      const res = await request(app).get('/posts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('body');
      expect(res.body[0]).toHaveProperty('userId');
      expect(res.body[0]).toHaveProperty('createdAt');
    });
  });

  describe('GET /posts/:id', () => {
    it('returns a post by id', async () => {
      const res = await request(app).get(`/posts/${SEED_IDS.post1}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: SEED_IDS.post1,
        title: 'Getting Started with Web Development',
        userId: SEED_IDS.userAlice,
      });
    });

    it('returns 404 for non-existent post', async () => {
      const res = await request(app).get(`/posts/${NON_EXISTENT_ID}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /posts', () => {
    it('creates a new post', async () => {
      const res = await request(app).post('/posts').send({
        title: 'Test Post',
        body: 'Test body content',
        userId: SEED_IDS.userAlice,
      });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: 'Test Post',
        body: 'Test body content',
        userId: SEED_IDS.userAlice,
      });
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('createdAt');
    });

    it('returns 400 for invalid body', async () => {
      const res = await request(app).post('/posts').send({ title: 'Only title' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 for non-existent userId', async () => {
      const res = await request(app).post('/posts').send({
        title: 'Test',
        body: 'Body',
        userId: NON_EXISTENT_ID,
      });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /posts/:id', () => {
    it('updates a post', async () => {
      const res = await request(app).put(`/posts/${SEED_IDS.post1}`).send({
        id: SEED_IDS.post1,
        title: 'Updated Title',
        body: 'Updated body',
        userId: SEED_IDS.userAlice,
        createdAt: '2025-01-15T10:00:00Z',
      });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
    });

    it('returns 404 for non-existent post', async () => {
      const res = await request(app).put(`/posts/${NON_EXISTENT_ID}`).send({
        id: NON_EXISTENT_ID,
        title: 'Title',
        body: 'Body',
        userId: SEED_IDS.userAlice,
        createdAt: new Date().toISOString(),
      });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('deletes a post', async () => {
      const createRes = await request(app).post('/posts').send({
        title: 'To Delete',
        body: 'Body',
        userId: SEED_IDS.userAlice,
      });
      const id = createRes.body.id;

      const deleteRes = await request(app).delete(`/posts/${id}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await request(app).get(`/posts/${id}`);
      expect(getRes.status).toBe(404);
    });

    it('returns 404 for non-existent post', async () => {
      const res = await request(app).delete(`/posts/${NON_EXISTENT_ID}`);
      expect(res.status).toBe(404);
    });
  });
});
