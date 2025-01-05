import Review from '../models/reviewModel.js';
import Booking from '../models/bookingModel.js';
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/httpError.js';

export const createReview = catchAsync(async (req, res, next) => {
  // 1. Get the tour and user
  const tourId = req.params.id;
  const userId = req.user.id;
  const { review, rating } = req.body;

  // 2. Check if tour exists
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new HttpError('Tour not found', 404));
  }

  // 3. Check if user booked the tour before
  const isBooked = await Booking.findOne({ tour: tourId, user: userId });
  if (!isBooked) {
    return next(new HttpError('You need to book the tour first to be able to review it', 400));
  }

  // 4. Check if user already reviewed the tour
  const reviewed = await Review.findOne({ tour: tourId, user: userId });
  if (reviewed) {
    return next(new HttpError('You already reviewed this tour', 400));
  }

  // 5. Create the review
  const newReview = await Review.create({
    review,
    rating,
    tour: tourId,
    user: userId,
  });

  // 6. Update the tour ratings
  tour.ratingsQuantity += 1;
  tour.ratingsAverage = (tour.ratingsAverage * (tour.ratingsQuantity - 1) + rating) / tour.ratingsQuantity;
  await tour.save();

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

export const updateReview = catchAsync(async (req, res, next) => {
  // 1. Get the review
  const userId = req.user.id;
  const reviewId = req.params.id;
  const { review, rating } = req.body;

  // 2. Check if the review exists
  const reviewToUpdate = await Review.findById(reviewId);
  if (!reviewToUpdate) {
    return next(new HttpError('Review not found', 404));
  }

  // 3. Check if the review belongs to the user
  if (reviewToUpdate.user.toString() !== userId) {
    return next(new HttpError('You are not allowed to update this review', 403));
  }

  // 4. update the tour
  const tour = await Tour.findById(reviewToUpdate.tour);
  tour.ratingsAverage =
    (tour.ratingsAverage * tour.ratingsQuantity - reviewToUpdate.rating + rating) / tour.ratingsQuantity;
  await tour.save();

  // 5. Update the review
  reviewToUpdate.review = review;
  reviewToUpdate.rating = rating;
  await reviewToUpdate.save();

  // 6. Send the response
  res.status(200).json({
    status: 'success',
    data: {
      review: reviewToUpdate,
    },
  });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  // 1. Get the review
  const userId = req.user.id;
  const reviewId = req.params.id;

  // 2. Check if the review exists
  const reviewToDelete = await Review.findById(reviewId);
  if (!reviewToDelete) {
    return next(new HttpError('Review not found', 404));
  }

  // 3. Check if the review belongs to the user
  if (reviewToDelete.user.toString() !== userId) {
    return next(new HttpError('You are not allowed to delete this review', 403));
  }

  // 4. Update the tour
  const tour = await Tour.findById(reviewToDelete.tour);
  tour.ratingsAverage =
    (tour.ratingsAverage * tour.ratingsQuantity - reviewToDelete.rating) / (tour.ratingsQuantity - 1);
  tour.ratingsQuantity -= 1;
  await tour.save();

  // 5. Delete the review
  await reviewToDelete.deleteOne();

  // 6. Send the response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getAllReviews = catchAsync(async (req, res, next) => {
  // 1. Get the tour id
  const tourId = req.params.id;
  // 2. Get all reviews for the tour
  const reviews = await Review.find({ tour: tourId });
  // 3. Send the response
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
