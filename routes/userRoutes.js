import express from 'express';
import * as userController from './../controllers/userController.js';
import * as authMiddleware from './../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware.protectRoute); // must be authenticated to access any route below

router
  .route('/me')
  .get(userController.getProfile)
  .put(userController.updateProfile)
  .delete(userController.deleteProfile);

router.put('/me/password', userController.updatePassword);

export default router;
