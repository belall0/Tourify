import crypto from 'node:crypto';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/httpError.js';
import { HttpStatus } from '../utils/responseHandler.js';
import { generateToken } from '../utils/jwtUtils.js';
import { filterObjectFields } from '../utils/dataFilter.js';
import Email from '../utils/emailService.js';
import { uploadToCloudinary } from '../middlewares/uploadHandler.js';

export const signup = catchAsync(async (req, res, next) => {
  // 1. Sanitize request body to remove unwanted fields
  const filteredBody = filterObjectFields(req.body, ['name', 'email', 'role', 'password', 'photo']);

  // 2. Create new user
  const user = new User(filteredBody);

  // 3. upload profile photo to cloudinary
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'users',
      public_id: `user-${user._id}`,
      isProfilePhoto: true,
    });

    user.photoUrl = result.url;
    user.photo = result.public_id;
  } else {
    user.photoUrl = 'https://res.cloudinary.com/dnjmqmbcb/image/upload/v1735521771/default_m4q3fx.jpg';
    user.photo = 'default';
  }

  // 4. generate email verification code
  const emailVerificationCode = user.createEmailVerificationCode();

  // 5. Save user to database
  await user.save();

  // 6. Send verification code to user's email
  await new Email(user, emailVerificationCode).sendEmailVerification();

  // 7. Send response
  res.status(HttpStatus.CREATED).json({
    status: 'success',
    message:
      'Thanks for signing up! Please check your email (including spam) to activate your account. You have 10 minutes to verify your email',
  });
});

export const resendVerificationCode = catchAsync(async (req, res, next) => {
  // 1. Get the email from the request and check if it exists
  const { email } = req.body;
  if (!email) {
    return next(new HttpError('Please provide email!', HttpStatus.BAD_REQUEST));
  }

  // 2. Find the user associated with the email
  const user = await User.findOne({
    email,
    isAccountVerified: false,
  });

  if (!user) {
    return next(new HttpError('No unverified user found with this email address', HttpStatus.NOT_FOUND));
  }

  // 3. Generate a new email verification code
  const emailVerificationCode = user.createEmailVerificationCode();

  // 4. Save the new verification code and expiry time to the user document
  await user.save();

  // 5. Send the new verification code to the user's email
  await new Email(user, emailVerificationCode).sendEmailVerification();

  // 6. Send response with message
  res.status(HttpStatus.OK).json({
    status: 'success',
    message: 'Verification code sent to email. you have 10 minutes to verify your email',
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  // 1. Get the email and verification code from the request and check if they exist
  const { email, verificationCode } = req.body;
  if (!email || !verificationCode) {
    return next(new HttpError('Please provide email and verification code!', HttpStatus.BAD_REQUEST));
  }

  // 2. Hash the verification code to compare it with the stored hashed code
  const hashedCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

  // 3. Find the user associated with the valid verification code
  const user = await User.findOne({
    verificationCode: hashedCode,
    verificationCodeExpiry: { $gt: Date.now() }, // check if the token is not expired
  });

  if (!user) {
    return next(new HttpError('Invalid or expired verification code', HttpStatus.BAD_REQUEST));
  }

  // 4. Update the user's emailVerified field to true and clear the verification code and expiry time
  user.isAccountVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiry = undefined;

  // 5. Save the updated user document
  await user.save();

  // 6. Generate JWT
  const token = generateToken(user._id);

  // 7. Set cookie with token
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  });

  // 6. Send response with message
  res.status(HttpStatus.OK).json({
    status: 'success',
    token,
    message: 'Email verified successfully',
  });
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

  // 3. Check if user's email is verified
  if (!user.isAccountVerified) {
    return next(new HttpError('Please verify your email to login', HttpStatus.FORBIDDEN));
  }

  // 4. Generate token
  const token = generateToken(user._id);

  // 5. Set cookie with token
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  });

  // 6. Send response with token
  res.status(HttpStatus.OK).json({
    status: 'success',
    token,
    message: 'Logged in successfully',
  });
});

export const logout = catchAsync(async (req, res, next) => {
  // 1. set the cookie with a dummy token and short expiry time to log out
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: true,
  });

  // 2. Send response with message
  res.status(HttpStatus.OK).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

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
  const resetURL = `${req.protocol}://${req.get('host')}/api/users/reset-password/token=${resetToken}`;

  // 5.Send email with reset link
  try {
    await new Email(user, resetURL).sendPasswordReset();

    // 6. save user document with the new password reset token and expiry time
    await user.save();

    // 7. Send response with message
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Password reset token sent to email successfully, You have 10 minutes to reset your password',
    });
  } catch (err) {
    return next(
      new HttpError(
        'There was an error sending the reset password email. Try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
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

  // 3. Hash the reset token to compare it with the stored hashed token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // 4. Find the user associated with the valid reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiry: { $gt: Date.now() }, // check if the token is not expired
  });

  // 5. Handle case where no user is found (invalid or expired token)
  if (!user) {
    return next(new HttpError('Token is invalid or has expired', HttpStatus.NOT_FOUND));
  }

  // 6. Update the user's password with the new password
  user.password = newPassword;

  // 7. Clear the password reset token and expiry time to prevent reuse
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiry = undefined;

  // 8. Save the updated user document
  await user.save();

  // 9. Generate JWT and send it in a cookie
  const newToken = generateToken(user._id);

  // 10. Set cookie with token and send response
  res.cookie('jwt', newToken, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  });

  res.status(HttpStatus.OK).json({
    status: 'success',
    token: newToken,
    message: 'Password reset successfully',
  });
});
