import express from 'express';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// user routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// admin routes
router.route('/').get(userController.getAllUsers).post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
