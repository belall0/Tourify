import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
dotenv.config();

let mongoServer;

export const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
};

// mock data to seed the database
export const mockUsers = [
  {
    name: 'customer1',
    email: 'customer1@domain.com',
    password: 'customer1-password',
    role: 'customer',
  },
];
