import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/httpError.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import { generateToken } from '../utils/jwtUtils.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'node:util';
// import { sendMail } from '../utils/emailService.js';
import crypto from 'node:crypto';
import { filterObjectFields, filterDocumentFields } from '../utils/dataFilter.js';

export const signup = catchAsync(async (req, res, next) => {
  // 1. Filter and sanitize input fields to prevent unauthorized data injection
  const filteredBody = filterObjectFields(req.body, ['_id', 'name', 'email', 'photo', 'role', 'password']);

  // 2. Create user in the database using only the filtered, safe fields
  const user = await User.create(filteredBody);

  // 3. Filter user document to remove sensitive information from the response
  const filteredUser = filterDocumentFields(user, ['name', 'email', 'photo', 'role']);

  // 4. generate token
  const token = generateToken(user._id);

  // 5. set cookie with token
  res.cookie('jwt', token, {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  });

  // 6. Send successful response with created user data and authentication token
  success(res, HttpStatus.CREATED, filteredUser, 'user', token);
});

export const login = catchAsync(async (req, res, next) => {
  // 1. Get email and password from request body and check if they exist
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HttpError('Please provide email and password!', HttpStatus.BAD_REQUEST));
  }

  // 2. Check if user exists and password is correct
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    return next(new HttpError('Invalid email or password', HttpStatus.UNAUTHORIZED));
  }

  // 3. Generate token
  const token = generateToken(user._id);

  // 4. Set cookie with token
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  // 5. Send response with token
  success(res, HttpStatus.OK, null, null, token);
});

export const logout = catchAsync(async (req, res, next) => {
  // 1. set the cookie with a dummy token and an expired date in the past
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  // 2. Send response with message
  success(res, HttpStatus.OK, null, null, null, 'Logged out successfully');
});

export const protectRoute = catchAsync(async (req, res, next) => {
  // 1. Check if token exists
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
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

  // 5. Grant access to protected route
  req.user = currentUser;
  next();
});

// only for rendered pages, no errors
export const checkAuth = async (req, res, next) => {
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

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new HttpError('You do not have permission to perform this action.', HttpStatus.FORBIDDEN));
    }

    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Validate Email
  const { email } = req.body;
  if (!email) {
    return next(new HttpError('Please provide an email address', HttpStatus.BAD_REQUEST));
  }

  // 2. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new HttpError('No user found with this email address', HttpStatus.NOT_FOUND));
  }

  // 3. generate password reset token
  const resetToken = user.createPasswordResetToken();

  // 4. Create password reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;

  // 5.Send email with reset link
  const mailOptions = {
    from: 'Belal Muhammad <belallmuhammad0@gmail.com',
    to: user.email,
    subject: 'Password Reset Token (Valid for 10 minutes)',
    text: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\n
             If you didn't request this, please ignore this email.`,
  };

  try {
    // await sendMail(mailOptions);

    // Save reset token and expiration only after email sends successfully
    await user.save();

    success(res, HttpStatus.OK, null, null, null, 'Password reset token sent to email');
  } catch (error) {
    return next(new HttpError('Error sending reset email', HttpStatus.INTERNAL_SERVER_ERROR));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1. Extract the reset token and new password from the request
  const token = req.params.token;
  const newPassword = req.body.newPassword;

  // 2. Check if the new password is provided
  if (!newPassword) {
    return next(new HttpError('newPassword is required', HttpStatus.BAD_REQUEST));
  }

  // 3. Hash the reset token to securely compare it with the stored hashed token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // 4. Find the user associated with the valid reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiry: { $gt: Date.now() },
  });

  // 5. Handle case where no user is found (invalid or expired token)
  if (!user) {
    return next(new HttpError('Token is invalid or has expired', HttpStatus.BAD_REQUEST));
  }

  // 6. Update the user's password with the new password
  user.password = newPassword;

  // 7. Clear the password reset token and expiry time to prevent reuse
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiry = undefined;

  await user.save();
  success(res, HttpStatus.OK, null, null, generateToken(user._id), 'Password reset successfully');
});
