import Tour from '../models/tourModel.js';
import { HttpStatus, ResponseHandler } from '../utils/responseHandler.js';

export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({});
    ResponseHandler.success(res, HttpStatus.OK, tours, 'tours');
  } catch (error) {
    ResponseHandler.error(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    ResponseHandler.success(res, HttpStatus.CREATED, tour, 'tour');
  } catch (error) {
    ResponseHandler.error(res, HttpStatus.BAD_REQUEST, error.message);
  }
};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    ResponseHandler.success(res, HttpStatus.OK, tour, 'tour');
  } catch (error) {
    ResponseHandler.error(res, HttpStatus.BAD_REQUEST, error.message);
  }
};

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    ResponseHandler.success(res, HttpStatus.OK, tour, 'tour');
  } catch (error) {
    ResponseHandler.error(res, HttpStatus.BAD_REQUEST, error.message);
  }
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    ResponseHandler.success(res, HttpStatus.NO_CONTENT);
  } catch (error) {
    ResponseHandler.error(res, HttpStatus.BAD_REQUEST, error.message);
  }
};
