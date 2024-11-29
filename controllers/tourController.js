import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import HttpError from '../utils/httpError.js';

export const getAllTours = catchAsync(async (req, res, next) => {
  // 1. Initialize query
  let query = Tour.find();

  // 2. Build query: filter, sort, paginate, select
  query = APIFeatures.filter(query, req.query);
  query = APIFeatures.sort(query, req.query);
  query = APIFeatures.paginate(query, req.query);
  query = APIFeatures.select(query, req.query);

  // 3. Execute query
  const tours = await query;

  // 4. Send response
  success(res, HttpStatus.OK, tours, 'tours');
});

export const createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  success(res, HttpStatus.CREATED, tour, 'tour');
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour)
    return next(new HttpError(`No tour found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  success(res, HttpStatus.OK, tour, 'tour');
});

export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour)
    return next(new HttpError(`No tour found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  Object.assign(tour, req.body);
  await tour.save(); // Save the updated tour to the database to trigger the pre-save middleware

  success(res, HttpStatus.OK, tour, 'tour');
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour)
    return next(new HttpError(`No tour found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  success(res, HttpStatus.NO_CONTENT);
});
