import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import { HttpStatus, ResponseHandler } from '../utils/responseHandler.js';
import HttpError from '../utils/httpError.js';

export const getAllTours = catchAsync(async (req, res, next) => {
  // initialize query object
  let query = Tour.find();

  // build query
  query = APIFeatures.filter(query, req.query);
  query = APIFeatures.sort(query, req.query);
  query = APIFeatures.paginate(query, req.query);
  query = APIFeatures.select(query, req.query);

  // execute query
  const tours = await query;

  // send response
  ResponseHandler.success(res, HttpStatus.OK, tours, 'tours');
});

export const createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  ResponseHandler.success(res, HttpStatus.CREATED, tour, 'tour');
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour)
    return next(new HttpError(`No tour found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  ResponseHandler.success(res, HttpStatus.OK, tour, 'tour');
});

export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour)
    return next(new HttpError(`No tour found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  ResponseHandler.success(res, HttpStatus.OK, tour, 'tour');
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour)
    return next(new HttpError(`No tour found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  ResponseHandler.success(res, HttpStatus.NO_CONTENT);
});
