import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import HttpError from '../utils/httpError.js';
import { filterObjectFields, filterDocumentFields } from '../utils/dataFilter.js';
import { generateToken } from '../utils/jwtUtils.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  success(res, HttpStatus.OK, users, 'users');
});

export const createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  success(res, HttpStatus.CREATED, user, 'user');
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new HttpError(`No user found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  success(res, HttpStatus.OK, user, 'user');
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new HttpError(`No user found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  Object.assign(user, req.body);
  await user.save();

  success(res, HttpStatus.OK, user, 'user');
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user)
    return next(new HttpError(`No user found with id: ${req.params.id}`, HttpStatus.NOT_FOUND));

  success(res, HttpStatus.NO_CONTENT);
});

export const updateCurrentUserProfile = catchAsync(async (req, res, next) => {
  // 1. Check if password update is requested
  const { password } = req.body;
  if (password) {
    return next(
      new HttpError(
        "Password updates are not allowed through this endpoint. To update your password, please use the '/api/users/update-password' endpoint.",
        HttpStatus.BAD_REQUEST,
      ),
    );
  }

  // 2. Filter and sanitize input fields to prevent unauthorized data injection
  const filteredBody = filterObjectFields(req.body, ['name', 'email', 'photo', 'role']);

  // 3. Check if there is no any valid fields to update
  const modifiedFields = Object.keys(filteredBody).length;
  if (!modifiedFields) {
    return next(
      new HttpError('No valid fields provided in the request body', HttpStatus.BAD_REQUEST),
    );
  }

  // 4. Merge the filtered fields into the user's current data
  Object.assign(req.user, filteredBody);
  await req.user.save();

  // 6. Filter user document to remove sensitive information from the response
  const filteredUser = filterDocumentFields(req.user, ['name', 'email', 'photo', 'role']);

  success(
    res,
    HttpStatus.ACCEPTED,
    filteredUser,
    'user',
    generateToken(req.user._id),
    'You data updated successfully',
  );
});
