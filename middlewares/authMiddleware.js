import jwt from 'jsonwebtoken';
import { promisify } from 'node:util';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/httpError.js';
import { HttpStatus } from '../utils/responseHandler.js';

export const protectRoute = catchAsync(async (req, res, next) => {
  // 1. Check if token exists
  let token = '';
  const isTokenHeaderExist =
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1] !== 'null';

  if (isTokenHeaderExist) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new HttpError('You are not logged in. Please log in to access this route.', HttpStatus.UNAUTHORIZED));
  }

  // 2. Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new HttpError('The user belonging to this token no longer exists.', HttpStatus.UNAUTHORIZED));
  }

  // 4. Check if user changed password after token was issued
  if (currentUser.isPasswordUpdatedAfter(decoded.iat)) {
    return next(new HttpError('User recently changed password. Please log in again.', HttpStatus.UNAUTHORIZED));
  }

  // 5. Set user in response locals to be used in the next middleware
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user.role is set in the protectRoute middleware
    if (!roles.includes(req.user.role)) {
      return next(new HttpError('You do not have permission to perform this action.', HttpStatus.FORBIDDEN));
    }

    next();
  };
};

export const checkAuth = async (req, res, next) => {
  // to render the header based on whether the user is logged in or not

  // 1. Check if token exists
  if (!req.cookies.jwt || req.cookies.jwt === 'loggedout') {
    return next();
  }

  // 2. Verify the token
  const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next();
  }

  // 4. Check if user changed password after token was issued
  if (currentUser.isPasswordUpdatedAfter(decoded.iat)) {
    return next();
  }

  // 5. render the header based on whether the user is logged in or not
  res.locals.user = currentUser;
  return next();
};
