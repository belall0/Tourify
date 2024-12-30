import Tour from './../models/tourModel.js';
import HttpError from '../utils/httpError.js';
import catchAsync from './../utils/catchAsync.js';

export const getOverview = catchAsync(async (req, res, next) => {
  // 1. fetch all tours
  const tours = await Tour.find({});

  // 2. render template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  // 1. get skug from url
  const slug = req.params.tourSlug;

  // 2. fetch the tour
  const tour = await Tour.findOne({ slug });
  if (!tour) {
    return next(new HttpError('There is no tour with that name.', 404));
  }

  // 3. render template
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

export const getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

export const getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Create your account!',
  });
});

export const getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account',
    user: req.user,
  });
});
