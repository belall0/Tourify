/**
 * This script is used to import or delete data from json files to the database.
 * It can be run from the command line using the following commands:
 *
 * 1. Import data:
 *   node config/data/handle-dev-data.js --import=modelName
 *
 * 2. Delete data:
 *  node config/data/import-dev-data.js --delete=modelName
 *
 * 3. Import all data:
 * node config/data/import-dev-data.js --importAll
 *
 * 4. Delete all data:
 * node config/data/import-dev-data.js --deleteAll
 *
 *
 * Replace modelName with user, tour, or review.
 */

import fs from 'node:fs';
import dotenv from 'dotenv';
import connectDB from '../dbConnection.js';
import User from '../../models/userModel.js';
import Tour from '../../models/tourModel.js';
import Review from '../../models/reviewModel.js';
dotenv.config();

// GENERIC FUNCTIONS
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

const validCommands = ['--import', '--delete', '--importAll', '--deleteAll'];
const validModels = ['user', 'tour', 'review'];

const operationHandler = async () => {
  // 1. get the command line arguments
  const [command, modelName] = process.argv[2].split('=');

  // 2. check if the command is valid
  if (!validCommands.includes(command)) {
    console.log('Invalid command. Please use --import, --delete, --importAll, or --deleteAll');
    process.exit(1);
  }

  // 3. connect to the database
  await connectDB();

  // 4. perform the operation
  if (command === '--importAll') {
    await importUsers();
    await importTours();
    await importReviews();
  } else if (command === '--deleteAll') {
    await deleteUsers();
    await deleteTours();
    await deleteReviews();
  } else {
    // handle modle specific operations
    if (!validModels.includes(modelName)) {
      console.log('Invalid model name. Please use user, tour, or review');
      process.exit(1);
    }

    // get the model
    const Model = modelName === 'user' ? User : modelName === 'tour' ? Tour : Review;

    if (command === '--import') {
      await importData(Model)();
    } else if (command === '--delete') {
      await deleteData(Model)();
    }
  }

  // 5. exit the process
  process.exit(1);
};

operationHandler();
