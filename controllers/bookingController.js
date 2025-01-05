import Booking from './../models/bookingModel.js';
import Tour from './../models/tourModel.js';
import HttpError from '../utils/httpError.js';
import catchAsync from './../utils/catchAsync.js';

export const createBooking = catchAsync(async (req, res, next) => {
  // 1. Get data from the request
  const userId = req.user.id;
  const tourId = req.params.id;
  const { slots } = req.body;

  // 2. Check if the tour exists
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new HttpError('No tour found with that ID', 404));
  }

  // Check if the slots are provided
  if (!slots) {
    throw new HttpError('Slots must be provided', 400);
  }

  // Check if slots is a valid number
  if (isNaN(slots) || slots <= 0) {
    throw new HttpError('Slots must be a positive number', 400);
  }

  // Check if there are enough slots available
  const availableSlots = tour.maxGroupSize - tour.numberOfBookings;
  if (availableSlots === 0) {
    throw new HttpError('Tour Fully Booked', 400);
  } else if (slots > availableSlots) {
    throw new HttpError(`Only ${availableSlots} slots available`, 400);
  }

  // 4. Calculate total price
  const totalPrice = slots * tour.price;

  // 5. Create the booking and check if the user has already booked the tour
  let booking;
  try {
    booking = await Booking.create({
      user: userId,
      tour: tourId,
      slots,
      totalPrice,
    });
  } catch {
    return next(new HttpError('You have already booked this tour', 400));
  }

  // 6. Update the number of bookings for the tour
  tour.numberOfBookings += slots;
  await tour.save();

  // 8. Send the response
  res.status(201).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

export const updateBooking = catchAsync(async (req, res, next) => {
  // 1. Get data from the request
  const userId = req.user.id;
  const bookingId = req.params.id;
  const { slots } = req.body;

  // 2. Check if the booking exists
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new HttpError('No booking found with that ID', 404));
  }

  // 3. check ownership
  if (booking.user._id.toString() !== userId) {
    return next(new HttpError('You are not authorized to update this booking', 403));
  }

  // 4. Check if the slots are provided
  if (!slots) {
    throw new HttpError('Slots must be provided', 400);
  }

  // 5. Check if slots is a valid number
  if (isNaN(slots) || slots <= 0) {
    throw new HttpError('Slots must be a positive number', 400);
  }

  // 6. Check if there are enough slots available
  const tour = await Tour.findById(booking.tour._id);
  const availableSlots = tour.maxGroupSize - tour.numberOfBookings + booking.slots;
  if (availableSlots === 0) {
    throw new HttpError('Tour Fully Booked', 400);
  } else if (slots > availableSlots) {
    throw new HttpError(`Only ${availableSlots} slots available`, 400);
  }

  // 7. update tours
  tour.numberOfBookings -= booking.slots;
  tour.numberOfBookings += slots;
  await tour.save();

  // 8. Calculate total price and update the booking
  const totalPrice = slots * tour.price;
  booking.slots = slots;
  booking.totalPrice = totalPrice;
  await booking.save();

  // 9. Send the response
  const newBooking = {
    _id: booking._id,
    user: booking.user._id,
    tour: booking.tour._id,
    slots: booking.slots,
    totalPrice: booking.totalPrice,
  };
  res.status(200).json({
    status: 'success',
    data: {
      newBooking,
    },
  });
});

export const deleteBooking = catchAsync(async (req, res, next) => {
  // 1. Get data from the request
  const userId = req.user.id;
  const bookingId = req.params.id;

  // 2. Check if the booking exists
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new HttpError('No booking found with that ID', 404));
  }

  // 3. check ownership
  if (booking.user._id.toString() !== userId) {
    return next(new HttpError('You are not authorized to delete this booking', 403));
  }

  // 4. update tours by reducing the number of bookings
  const tour = await Tour.findById(booking.tour._id);
  tour.numberOfBookings -= booking.slots;
  await tour.save();

  // 5. delete the booking
  await booking.deleteOne();
  // 6. Send the response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getAllBookings = catchAsync(async (req, res, next) => {
  // 1. Get data from the request
  const userId = req.user.id;
  const tourId = req.params.id;

  // 2. Check if the tour exists
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new HttpError('No tour found with that ID', 404));
  }

  // 3. Check ownership
  if (tour.ownerId._id.toString() !== userId) {
    return next(new HttpError('You are not authorized to view these bookings', 403));
  }

  // 4. Get all bookings for the tour
  const bookings = await Booking.find({ tour: tourId }).setOptions({ populateUser: true });

  // 5. Send the response
  res.status(200).json({
    status: 'success',
    data: {
      bookings,
    },
  });
});
