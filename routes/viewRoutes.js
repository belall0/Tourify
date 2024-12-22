import express from 'express';
import * as viewsController from './../controllers/viewsController.js';
import * as authController from './../controllers/authController.js';

const router = express.Router();

// check if user is logged in to render the header based on that
router.use(authController.checkAuth);

router.get('/', viewsController.getOverview);
router.get('/tours/:tourSlug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

export default router;
