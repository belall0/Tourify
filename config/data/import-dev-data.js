import fs from 'node:fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './../dbConnection.js';
import User from './../../models/userModel.js';
import Tour from './../../models/tourModel.js';
import Review from './../../models/reviewModel.js';

dotenv.config();

// GENERIC FUNCTIONS TO IMPORT AND DELETE DATA
const importData = (Model) => async () => {
  // 1. Read JSON file
  const data = JSON.parse(fs.readFileSync(`${import.meta.dirname}/${Model.modelName.toLowerCase()}.json`, 'utf-8'));
  // 2. Import data into DB
  await Model.create(data);
  // 3. Log success message
  console.log(`${Model.modelName.toLowerCase()} data successfully loaded!`);
};

const deleteData = (Model) => async () => {
  // 1. Delete all documents
  await Model.deleteMany();
  // 2. Log success message
  console.log(`${Model.modelName.toLowerCase()} data successfully deleted!`);
};

// MAIN FUNCTIONS
const importUsers = importData(User);
const importTours = importData(Tour);
const importReviews = importData(Review);

const deleteUsers = deleteData(User);
const deleteTours = deleteData(Tour);
const deleteReviews = deleteData(Review);

const operationHandler = async () => {
  // 1. read command line arguments
  const [command, name] = process.argv[2].split('=');
  // 2. make sure the arguments are valid
  const isValidCommand = command === '--import' || command === '--delete';
  const isValidModel = name === 'user' || name === 'tour' || name === 'review';
  if (!isValidCommand || !isValidModel) {
    console.log('Invalid command or model name!');
    process.exit(1);
  }
  // 3. connect to the database
  await connectDB();
  // 4. perform the operation
  if (command === '--import') {
    switch (name) {
      case 'user':
        await importUsers();
        break;
      case 'tour':
        await importTours();
        break;
      case 'review':
        await importReviews();
        break;
    }
  } else if (command === '--delete') {
    switch (name) {
      case 'user':
        await deleteUsers();
        break;
      case 'tour':
        await deleteTours();
        break;
      case 'review':
        await deleteReviews();
        break;
    }
  }

  // 5. exit the process
  process.exit();
};

operationHandler();
