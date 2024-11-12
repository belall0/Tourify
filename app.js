// 1. IMPORTS
const express = require('express');
const morgan = require('morgan');
const { tourRoutes } = require(`${__dirname}/routes/tourRoutes`);

// 2. APP INITIALIZATION
const app = express();

// 3. MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  next();
});

// 4. ROUTES
app.use('/api/tours', tourRoutes);

// 5. EXPORT APP
module.exports = { app };
