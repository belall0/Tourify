import express from 'express';
import * as tourController from '../controllers/tourControllers.js';

const router = express.Router();

router.param('id', tourController.validateTourExists);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.validateTourBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default router;
