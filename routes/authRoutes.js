import express from 'express';
import * as authController from '../controllers/authController.js';
import * as authMiddleware from './../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadHandler.js';

const router = express.Router();

router.post('/signup', upload.single('photo'), authController.signup);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationCode);
router.post('/login', authController.login);
router.post('/logout', authMiddleware.protectRoute, authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);

export default router;
