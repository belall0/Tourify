import express from 'express';
import * as tourController from '../controllers/tourController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protectRoute, authController.restrictTo('operator'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .put(authController.protectRoute, authController.restrictTo('operator'), tourController.updateTour)
  .delete(authController.protectRoute, authController.restrictTo('operator', 'admin'), tourController.deleteTour);

export default router;
