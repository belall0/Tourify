import Tour from './../models/tourModel.js';
import catchAsync from './../utils/catchAsync.js';

export const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find({});

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
export const getTour = catchAsync(async (req, res, next) => {
  const slug = req.params.tourSlug;
  const tour = await Tour.findOne({ slug });
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
