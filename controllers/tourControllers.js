import fs from 'node:fs';
const __dirname = import.meta.dirname;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../db/db.json`, {
    encoding: 'utf-8',
  }),
);

export const validateTourExists = (req, res, next, value) => {
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

export const validateTourBody = (req, res, next) => {
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

export const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    resultCount: tours.length,
    data: {
      tours,
    },
  });
};

export const createTour = (req, res) => {
  const id = tours.length > 0 ? tours[tours.length - 1].id + 1 : 1;
  const tour = Object.assign({ id }, req.body);
  tours.push(tour);

  fs.writeFile(
    `${__dirname}/../db/db.json`,
    JSON.stringify(tours),
    { encoding: 'utf-8' },
    (err) => {
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
    },
  );
};

export const getTour = (req, res) => {
  const tour = req.tour;

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

export const updateTour = (req, res) => {
  const tour = req.tour;
  const tourIndex = req.tourIndex;

  const newTour = Object.assign({}, tour, req.body);
  tours[tourIndex] = newTour;

  fs.writeFile(
    `${__dirname}/../db/db.json`,
    JSON.stringify(tours),
    { encoding: 'utf-8' },
    (err) => {
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
    },
  );
};

export const deleteTour = (req, res) => {
  const tourIndex = req.tourIndex;

  const deletedTour = tours.splice(tourIndex, 1);

  fs.writeFile(
    `${__dirname}/../db/db.json`,
    JSON.stringify(tours),
    { encoding: 'utf-8' },
    (err) => {
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
    },
  );
};
