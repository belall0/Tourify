import User from '../models/userModel.js';
import * as factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/httpError.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import { generateToken } from '../utils/jwtUtils.js';
import { filterObjectFields, filterDocumentFields } from '../utils/dataFilter.js';
import multer from 'multer';
import mongoose from 'mongoose';

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/users');
  },

  filename: (req, file, cb) => {
    // 1. Get the file extension
    const ext = file.mimetype.split('/')[1];

    // 2. Generate a unique file name for the user's photo
    let userId = '';
    // If the user is not logged in, generate a random id for the user and attach it to the request body to be used later as the user._id
    if (!req.user) {
      userId = new mongoose.Types.ObjectId();
      req.body._id = userId;
    } else {
      userId = req.user._id;
    }
    const fileName = `user-${userId}.${ext}`;

    cb(null, fileName);
  },
});

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new HttpError('Not an image!, Please upload only images.', 400), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

export const setUserId = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

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

  // 4. Update the user's password with the new password provided in the request body. and send a success response to the client
  user.password = newPassword;
  await user.save();

  // 3. generate a new token for the user and send it in the response
  const token = generateToken(req.user._id);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  success(res, HttpStatus.OK, null, null, token, 'Password Updated Successfully');
});

export const updateCurrentUser = catchAsync(async (req, res, next) => {
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
  if (!modifiedFields && !req.file) {
    return next(new HttpError('No valid fields provided in the request body', HttpStatus.BAD_REQUEST));
  }

  // 4. update user photo if there is a photo in the request
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }

  // 5. Merge the filtered fields into the user's current data
  Object.assign(req.user, filteredBody);
  await req.user.save();

  // 6. Filter user document to remove sensitive information from the response
  const filteredUser = filterDocumentFields(req.user, ['name', 'email', 'photo', 'role']);

  success(res, HttpStatus.ACCEPTED, filteredUser, 'user', generateToken(req.user._id), 'You data updated successfully');
});

export const getCurrentUser = factory.getOne(User);
export const deleteCurrentUser = factory.deleteOne(User);

// Admin Routes
export const getAllUsers = factory.getAll(User);
export const getUserById = factory.getOne(User);
export const deleteUserById = factory.deleteOne(User);
