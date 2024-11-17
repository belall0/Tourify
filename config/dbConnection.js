import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Database connection established successfully!');
  } catch (error) {
    console.log('Error connecting to the database:', error.message);
  }
};

export default connectDB;
