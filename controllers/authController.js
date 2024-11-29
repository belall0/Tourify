import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/httpError.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import { generateToken } from '../utils/jwtUtils.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'node:util';

export const signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = generateToken(user._id);
  user.password = undefined; // hide password from response

  success(res, HttpStatus.CREATED, user, 'user', token);
});

export const login = catchAsync(async (req, res, next) => {
  // 1. Get email and password from request body and check if they exist
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HttpError('Please provide email and password!', HttpStatus.BAD_REQUEST));
  }

  // 2. Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.isPasswordCorrect(password))) {
    return next(new HttpError('Invalid email or password', HttpStatus.UNAUTHORIZED));
  }

  // 3. Generate token
  const token = generateToken(user._id);

  // 4. Send response with token
  success(res, HttpStatus.OK, null, null, token);
});

export const protectRoute = catchAsync(async (req, res, next) => {
  // 1. Check if token exists
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new HttpError(
        'You are not logged in. Please log in to access this route.',
        HttpStatus.UNAUTHORIZED,
      ),
    );
  }

  // 2. Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+passwordUpdatedAt');
  if (!currentUser) {
    return next(
      new HttpError('The user belonging to this token no longer exists.', HttpStatus.UNAUTHORIZED),
    );
  }

  // 4. Check if user changed password after token was issued
  if (currentUser.isPasswordUpdatedAfter(decoded.iat)) {
    console.log('Password changed');
    return next(
      new HttpError(
        'User recently changed password. Please log in again.',
        HttpStatus.UNAUTHORIZED,
      ),
    );
  }

  // 5. Grant access to protected route
  req.user = currentUser;
  next();
});
