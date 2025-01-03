import express from 'express';
import * as viewsController from './../controllers/viewsController.js';
// import * as authController from './../controllers/authController.js';
import * as authMiddleware from './../middlewares/authMiddleware.js';

const router = express.Router();

// check if user is logged in to render the header based on that
router.use(authMiddleware.checkAuth);

router.get('/', viewsController.getOverview);
router.get('/tours/:tourSlug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);
router.get('/me', authMiddleware.protectRoute, viewsController.getAccount);

export default router;
