// 1. IMPORTS
const fs = require('node:fs');

// 2. TOURS INITIALIZATION
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../db/db.json`, {
    encoding: 'utf-8',
  })
);

// 3. CONTROLLERS
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
  const tour = tours.find((el) => el.id === req.params.id);

  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Tour not found',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  const id = req.params.id;
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `tour with id: ${id} not found`,
    });
  }

  const newTour = Object.assign({}, tour, req.body);
  const tourIndx = tours.findIndex((el) => el === tour);
  tours[tourIndx] = newTour;

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
  const id = req.params.id;
  const tourIndx = tours.findIndex((tour) => tour.id === id);
  if (tourIndx === -1) {
    return res.status(404).json({
      status: 'fail',
      message: `tour with id: ${id} not found`,
    });
  }
  const deletedTour = tours.splice(tourIndx, 1);

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
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
