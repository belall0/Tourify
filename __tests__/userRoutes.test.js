import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectDB, disconnectDB, mockUsers } from './setup.js';
import app from '../app.js';
import request from 'supertest';

let mongoServer;
beforeAll(async () => {
  await connectDB();
});

// Setup Mock Data
const mockUser = {
  name: 'customer1',
  email: 'customer1@domain.com',
  password: 'customer1-password',
  role: 'customer',
};

describe('POST /api/auth/signup', () => {
  it("Should return a 201 status code along with the user's data and token, excluding the password.", async () => {
    const res = await request(app).post('/api/auth/signup').send(mockUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user.name).toBe(mockUser.name);
    expect(res.body.data.user.email).toBe(mockUser.email);
    expect(res.body.data.user.role).toBe(mockUser.role);
    expect(res.body.data.user).not.toHaveProperty('password');
  });

  it('should return a 400 status code with error message if the email is already taken', async () => {
    const res = await request(app).post('/api/auth/signup').send(mockUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email/);
  });
});

describe('GET /api/auth/login', () => {
  it('should return a 200 status code along with the token', async () => {
    // Arrange
    const loginData = {
      email: mockUser.email,
      password: mockUser.password,
    };

    // Act
    const res = await request(app).post('/api/auth/login').send(loginData);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return a 401 status code with error message if the email or password is incorrect', async () => {
    // Arrange
    const loginData = {
      email: mockUser.email,
      password: 'wrong-password',
    };

    // Act
    const res = await request(app).post('/api/auth/login').send(loginData);

    // Assert
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/email/);
  });
});

afterAll(async () => {
  await disconnectDB();
});
