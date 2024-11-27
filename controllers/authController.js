import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/httpError.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import { generateToken } from '../utils/jwtUtils.js';

export const signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = generateToken(user._id);
  user.password = undefined; // hide password from response

  success(res, HttpStatus.CREATED, user, 'user', token);
});

export const login = catchAsync(async (req, res, next) => {
  // 1) Check if email and password exist, if not send error
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HttpError('Please provide email and password!', HttpStatus.BAD_REQUEST));
  }

  // 2) Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.isCorrectPassword(password))) {
    return next(new HttpError('Invalid email or password', HttpStatus.UNAUTHORIZED));
  }

  // 4) If everything is ok, send token to client
  const token = generateToken(user._id);
  success(res, HttpStatus.OK, null, null, token);
});
