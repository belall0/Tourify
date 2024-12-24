import express from 'express';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/signup', userController.uploadUserPhoto, authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);
router.put('/update-password', authController.protectRoute, userController.updatePassword);

// Protected routes
router
  .route('/me')
  .get(authController.protectRoute, userController.setUserId, userController.getCurrentUser)
  .put(
    authController.protectRoute,
    userController.setUserId,
    userController.uploadUserPhoto,
    userController.updateCurrentUser,
  )
  .delete(authController.protectRoute, userController.setUserId, userController.deleteCurrentUser);

// Admin routes
router.route('/').get(authController.protectRoute, authController.restrictTo('admin'), userController.getAllUsers);
router
  .route('/:id')
  .get(authController.protectRoute, authController.restrictTo('admin'), userController.getUserById)
  .delete(authController.protectRoute, authController.restrictTo('admin'), userController.deleteUserById);
export default router;
