import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('Database connection established successfully!');
  } catch (error) {
    console.log('Error connecting to the database:', error.message);
  }
};

export default connectDB;
