import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/httpError.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import { generateToken } from '../utils/jwtUtils.js';
import { filterObjectFields, filterDocumentFields } from '../utils/dataFilter.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middlewares/uploadHandler.js';
import Email from '../utils/emailService.js';
import Tour from '../models/tourModel.js';
import Booking from '../models/bookingModel.js';
import Review from '../models/reviewModel.js';

export const getProfile = catchAsync(async (req, res, next) => {
  // 1. Filter user document to remove sensitive information from the response
  const filteredUser = filterDocumentFields(req.user, ['_id', 'name', 'email', 'role', 'photoUrl']);

  // 2. Send the filtered user document in the response to the client
  res.status(HttpStatus.OK).json({
    status: 'success',
    user: filteredUser,
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  // 1. Check if password update is attempted
  if (req.body.password) {
    return next(
      new HttpError(
        'This route is not for password updates. Please use /api/users/me/password route.',
        HttpStatus.BAD_REQUEST,
      ),
    );
  }

  // 2. Sanitize the request body
  const sanitizedBody = filterObjectFields(req.body, ['name', 'email', 'role']);

  // 3. Check if there are any fields to update
  if (Object.keys(sanitizedBody).length === 0 && !req.file) {
    return next(new HttpError('No valid fields to update', HttpStatus.BAD_REQUEST));
  }

  // 4. Handle photo upload if present
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'users',
      public_id: `user-${req.user._id}`,
      isProfilePhoto: true,
    });

    sanitizedBody.photoUrl = result.url;
    sanitizedBody.photo = result.public_id;
  }

  // 5. Handle email update if present
  const isEmailChanged = sanitizedBody.email && sanitizedBody.email !== req.user.email;
  if (isEmailChanged) {
    // Send verification code to user's email
    const emailVerificationCode = req.user.createEmailVerificationCode();
    await new Email(req.user, emailVerificationCode).sendEmailVerification();

    // set isAccountVerified to false
    req.user.isAccountVerified = false;
  }

  // 6. Merge the filtered fields into the user's current data and save the user document
  Object.assign(req.user, sanitizedBody);
  await req.user.save();

  // 7. Filter user document to remove sensitive information from the response
  const filteredUser = filterDocumentFields(req.user, ['_id', 'name', 'email', 'role', 'photoUrl']);

  // 8. Send the updated user document in the response to the client along with a success message
  const response = {
    status: 'success',
  };
  if (isEmailChanged) {
    response.message = 'Your profile has been updated. Please verify your new email to continue.';
    // log out user from all devices if the user updates their email
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  } else {
    response.message = 'Your profile has been updated successfully';
    response.user = filteredUser;
  }
  res.status(HttpStatus.OK).json(response);
});

export const deleteProfile = catchAsync(async (req, res, next) => {
  // 1. Delete the user document from the database
  const user = await User.findByIdAndDelete(req.user._id);
  // 2. Delete the user's profile photo from cloudinary
  await deleteFromCloudinary(user.photo);

  // 3. Send a success response to the client
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(HttpStatus.OK).json({
    status: 'success',
    message: 'Your account has been deleted successfully',
  });
});

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
    return next(new HttpError('Current password is incorrect', HttpStatus.BAD_REQUEST));
  }

  // 3. Update the user's password with the new password provided in the request body. and send a success response to the client
  user.password = newPassword;
  await user.save();

  // 4. generate a new token for the user and send it in the response
  const token = generateToken(req.user._id);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  success(res, HttpStatus.OK, null, null, token, 'Password Updated Successfully');
});

export const getMyTours = catchAsync(async (req, res, next) => {
  console.log(req.user.id);
  const tours = await Tour.find({ ownerId: req.user.id });

  success(res, HttpStatus.OK, tours, 'tours');
});

export const getMyBookings = catchAsync(async (req, res, next) => {
  // 1. Find all bookings of the current user
  const bookings = await Booking.find({ user: req.user.id }).setOptions({ skipPopulation: true }); // Skip population for performance

  res.status(HttpStatus.OK).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

export const getMyReviews = catchAsync(async (req, res, next) => {
  // 1. Find all reviews of the current user
  const reviews = await Review.find({ user: req.user.id }).setOptions({ skipPopulation: true }); // Skip population for performance

  res.status(HttpStatus.OK).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
