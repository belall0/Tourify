import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URI = process.env.DB_URI.replace('<DB_USERNAME>', DB_USERNAME).replace('<DB_PASSWORD>', DB_PASSWORD);

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Database connection established successfully!');
  } catch (error) {
    console.log('Error connecting to the database:', error.message);
  }
};

export default connectDB;
