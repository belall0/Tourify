import User from '../models/userModel.js';
import * as factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/httpError.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import { generateToken } from '../utils/jwtUtils.js';
import { filterObjectFields, filterDocumentFields } from '../utils/dataFilter.js';

// User Operations
export const updatePassword = catchAsync(async (req, res, next) => {
  // 1. Check if both currentPassword and newPassword are provided in the request.
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new HttpError('Please provide your current password along with the new password.', HttpStatus.BAD_REQUEST),
    );
  }

  // 2. Check if the provided current password matches the user's actual password.
  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) {
    return next(new HttpError('Current password is incorrect', HttpStatus.UNAUTHORIZED));
  }

  // 3. Update the user's password with the new password provided in the request body. and send a success response to the client
  user.password = newPassword;
  await user.save();

  success(res, HttpStatus.OK, null, null, generateToken(req.user._id), 'Password Updated Successfully');
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
    return next(new HttpError('No valid fields provided in the request body', HttpStatus.BAD_REQUEST));
  }

  // 4. Merge the filtered fields into the user's current data
  Object.assign(req.user, filteredBody);
  await req.user.save();

  // 6. Filter user document to remove sensitive information from the response
  const filteredUser = filterDocumentFields(req.user, ['name', 'email', 'photo', 'role']);

  success(res, HttpStatus.ACCEPTED, filteredUser, 'user', generateToken(req.user._id), 'You data updated successfully');
});

// CRUD Operations for Admin
export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
export const createUser = factory.createOne(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
