// 1. IMPORTS
const express = require('express');

// 2. CONTROLLERS
const { getAllTours, createTour, getTour, updateTour, deleteTour } = require(`${__dirname}/../controllers/tourControllers`);

// 3. ROUTER INITIALIZATION
const router = express.Router();

// 4. ROUTER MIDDLEWARE
router.param('id', (req, res, next, value) => {
  req.params.id = parseInt(value);

  next();
});

// 5. ROUTES
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// 6. EXPORT ROUTER
module.exports = { tourRoutes: router };
