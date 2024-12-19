import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectDB, disconnectDB, mockUsers } from './setup.js';
import app from '../app.js';
import request from 'supertest';

let mongoServer;
beforeAll(async () => {
  await connectDB();
});

describe('GET /api/tours', () => {
  it('should return a 200 status code along with the tours data', async () => {
    const res = await request(app).get('/api/tours');

    expect(res.status).toBe(200);
  });
});

describe('POST /api/tours', () => {
  it('should return a 401 status code with error message if the user is not authorized', async () => {
    const tour = {
      name: 'tour2',
      duration: 7,
      maxGroupSize: 15,
      difficulty: 'medium',
      price: 497,
      summary: 'Test Tour Summmmmmmmmmmmmmmmmmmmmmmmmmmary',
      description: 'general description',
      imageCover: 'tour-2-cover.jpg',
    };

    const res = await request(app).post('/api/tours').send(tour);

    expect(res.status).toBe(401);
  });
});

afterAll(async () => {
  await disconnectDB();
});
