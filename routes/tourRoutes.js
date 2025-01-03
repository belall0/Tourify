import express from 'express';
import * as tourController from '../controllers/tourController.js';
// import * as authController from '../controllers/authController.js';
import * as authMiddleware from './../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authMiddleware.protectRoute, authMiddleware.restrictTo('operator'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .put(authMiddleware.protectRoute, authMiddleware.restrictTo('operator'), tourController.updateTour)
  .delete(authMiddleware.protectRoute, authMiddleware.restrictTo('operator', 'admin'), tourController.deleteTour);

export default router;
