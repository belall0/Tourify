// 1. IMPORTS
const fs = require('node:fs');

// 2. TOURS INITIALIZATION
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../db/db.json`, {
    encoding: 'utf-8',
  })
);

// 3. MIDDLEWARES
const validateTourExists = (req, res, next, value) => {
  const id = parseInt(req.params.id);
  const tourIndex = tours.findIndex((tour) => tour.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: `tour with id: ${id} not found`,
    });
  }

  req.tour = tours[tourIndex];
  req.tourIndex = tourIndex;

  next();
};

const validateTourBody = (req, res, next) => {
  const { name, price } = req.body;

  if (!name || (!price && price != 0)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing required fields: tour must have name and price',
    });
  }

  if (price <= 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Price must be greater than 0',
    });
  }

  next();
};

// 4. CONTROLLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    resultCount: tours.length,
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  const id = tours.length > 0 ? tours[tours.length - 1].id + 1 : 1;
  const tour = Object.assign({ id }, req.body);
  tours.push(tour);

  fs.writeFile(`${__dirname}/../db/db.json`, JSON.stringify(tours), { encoding: 'utf-8' }, (err) => {
    if (err) {
      return res.status(500).json({
        status: 'Error',
        message: 'Error creating tour',
      });
    }

    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  });
};

const getTour = (req, res) => {
  const tour = req.tour;

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  const tour = req.tour;
  const tourIndex = req.tourIndex;

  const newTour = Object.assign({}, tour, req.body);
  tours[tourIndex] = newTour;

  fs.writeFile(`${__dirname}/../db/db.json`, JSON.stringify(tours), { encoding: 'utf-8' }, (err) => {
    if (err) {
      return res.status(500).json({
        status: 'Error',
        message: 'Error creating tour',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};

const deleteTour = (req, res) => {
  const tourIndex = req.tourIndex;

  const deletedTour = tours.splice(tourIndex, 1);

  fs.writeFile(`${__dirname}/../db/db.json`, JSON.stringify(tours), { encoding: 'utf-8' }, (err) => {
    if (err) {
      return res.status(500).json({
        status: 'Error',
        message: 'Error creating tour',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'tour deleted successfully',
    });
  });
};

// 4. EXPORT CONTROLLERS
module.exports = {
  validateTourBody,
  validateTourExists,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
