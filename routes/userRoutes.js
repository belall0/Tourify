import express from 'express';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';
import { upload } from './../middlewares/uploadHandler.js';

const router = express.Router();

router.post('/signup', upload.single('photo'), authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);
router.put('/update-password', authController.protectRoute, userController.updatePassword);

export default router;
