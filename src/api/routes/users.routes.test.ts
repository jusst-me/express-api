import request from 'supertest';

import app from '../../app';

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
      const res = await request(app).get('/users/1');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
      });
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).get('/users/999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /users/:id/posts', () => {
    it('returns posts for a user', async () => {
      const res = await request(app).get('/users/1/posts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every((p: { userId: string }) => p.userId === '1')).toBe(true);
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).get('/users/999/posts');
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
      const res = await request(app).put('/users/3').send({
        id: '3',
        name: 'Carol Updated',
        email: 'carol.updated@example.com',
      });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Carol Updated');
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).put('/users/999').send({
        id: '999',
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
      const res = await request(app).delete('/users/1');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 404 for non-existent user', async () => {
      const res = await request(app).delete('/users/999');
      expect(res.status).toBe(404);
    });
  });
});
