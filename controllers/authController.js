import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/httpError.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import { generateToken } from '../utils/jwtUtils.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'node:util';
import { sendMail } from '../utils/emailService.js';
import crypto from 'node:crypto';

export const signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const userWithoutSensitiveData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    photo: user.photo,
  };
  success(res, HttpStatus.CREATED, userWithoutSensitiveData, 'user', generateToken(user._id));
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

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HttpError('You do not have permission to perform this action.', HttpStatus.FORBIDDEN),
      );
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

  // 4. Save reset token and expiration to user document
  await user.save();

  // 5. Create password reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;

  // 6.Send email with reset link
  const mailOptions = {
    from: 'Belal Muhammad <belallmuhammad0@gmail.com',
    to: user.email,
    subject: 'Password Reset Token (Valid for 10 minutes)',
    text: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\n
             If you didn't request this, please ignore this email.`,
  };

  try {
    // send email
    await sendMail(mailOptions);
    success(res, HttpStatus.OK, null, null, null, 'Password reset token sent to email');
  } catch (error) {
    // if sending email failed, reset all fields
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;

    await user.save();

    return next(new HttpError('Error sending reset email', HttpStatus.INTERNAL_SERVER_ERROR));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1. Hash the token from the URL
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  // 2. Find user with valid reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiry: { $gt: Date.now() },
  });

  // 3. If token is invalid or expired
  if (!user) {
    return next(new HttpError('Token is invalid or has expired', HttpStatus.BAD_REQUEST));
  }

  // 4. Update Password
  user.password = req.body.password;

  // 5. clear reset token fields
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiry = undefined;

  await user.save();
  const token = generateToken(user._id);

  success(res, HttpStatus.OK, null, null, token, 'Password reset successfully');
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1. Find the user
  const user = await User.findById(req.user._id).select('+password');

  // 2. Verify current password
  const isPasswordCorrect = await user.isPasswordCorrect(req.body.password);
  if (!isPasswordCorrect) {
    return next(new HttpError('Current password is incorrect', HttpStatus.UNAUTHORIZED));
  }

  // 3. Save the updated password
  req.user.password = req.body.newPassword;
  await user.save();

  success(
    res,
    HttpStatus.OK,
    null,
    null,
    generateToken(req.user._id),
    'Password Updated Successfully',
  );
});
