import express from 'express';
import * as authMiddleware from './../middlewares/authMiddleware.js';
import * as reviewController from './../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(authMiddleware.protectRoute, authMiddleware.restrictTo('customer'), reviewController.createReview)
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .put(authMiddleware.protectRoute, authMiddleware.restrictTo('customer'), reviewController.updateReview)
  .delete(authMiddleware.protectRoute, authMiddleware.restrictTo('customer'), reviewController.deleteReview);

export default router;
