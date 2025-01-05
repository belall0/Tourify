import express from 'express';
import * as userController from './../controllers/userController.js';
import * as authMiddleware from './../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadHandler.js';

const router = express.Router();

router.use(authMiddleware.protectRoute); // must be authenticated to access any route below

router
  .route('/me')
  .get(userController.getProfile)
  .put(upload.single('photo'), userController.updateProfile)
  .delete(userController.deleteProfile);

router.put('/me/password', userController.updatePassword);
router.get('/me/tours', authMiddleware.protectRoute, authMiddleware.restrictTo('operator'), userController.getMyTours);
router.get(
  '/me/bookings',
  authMiddleware.protectRoute,
  authMiddleware.restrictTo('customer'),
  userController.getMyBookings,
);

router.get(
  '/me/reviews',
  authMiddleware.protectRoute,
  authMiddleware.restrictTo('customer'),
  userController.getMyReviews,
);

export default router;
