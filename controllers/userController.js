import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import HttpError from '../utils/httpError.js';

// DONE:
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  success(res, HttpStatus.OK, users, 'users');
});

// DONE:
export const createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  success(res, HttpStatus.CREATED, user, 'user');
});

// DONE:
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new HttpError(`No user found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  success(res, HttpStatus.OK, user, 'user');
});

// DONE:
export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new HttpError(`No user found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  Object.assign(user, req.body);
  await user.save();

  success(res, HttpStatus.OK, user, 'user');
});

// DONE:
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user)
    return next(new HttpError(`No user found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  success(res, HttpStatus.NO_CONTENT);
});
