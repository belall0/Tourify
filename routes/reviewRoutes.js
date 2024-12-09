import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });

router.use(authController.protectRoute);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

export default router;
