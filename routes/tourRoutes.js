import express from 'express';
import * as tourController from '../controllers/tourController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.use(authController.protectRoute);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.restrictTo('admin'), tourController.updateTour)
  .delete(authController.restrictTo('admin'), tourController.deleteTour);

export default router;
