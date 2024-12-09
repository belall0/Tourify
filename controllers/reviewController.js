import Review from './../models/reviewModel.js';
import catchAsync from './../utils/catchAsync.js';
import { HttpStatus, success } from './../utils/responseHandler.js';

export const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.id;
  }

  if (!req.body.user) {
    req.body.user = req.user._id;
  }

  const review = await Review.create(req.body);
  success(res, HttpStatus.CREATED, review, 'review');
});

export const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) {
    filter = { tour: req.params.id };
  }

  const reviews = await Review.find(filter);
  success(res, HttpStatus.OK, reviews, 'reviews');
});
