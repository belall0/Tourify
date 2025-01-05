import express from 'express';
import * as authMiddleware from './../middlewares/authMiddleware.js';
import * as bookingController from './../controllers/bookingController.js';

// Merge the URL parameters from the tours
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(authMiddleware.protectRoute, authMiddleware.restrictTo('customer'), bookingController.createBooking)
  .get(authMiddleware.protectRoute, authMiddleware.restrictTo('operator'), bookingController.getAllBookings);

router
  .route('/:id')
  .put(authMiddleware.protectRoute, authMiddleware.restrictTo('customer'), bookingController.updateBooking)
  .delete(authMiddleware.protectRoute, authMiddleware.restrictTo('customer'), bookingController.deleteBooking);

export default router;
