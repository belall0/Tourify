import express from 'express';
import morgan from 'morgan';
import tourRoutes from './routes/tourRoutes.js';
import HttpError from './utils/httpError.js';
import globalMiddlewareHandler from './middlewares/errorHandlers/errorMiddleware.js';

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/tours', tourRoutes);

// 404 handler
app.all('*', (req, res, next) => {
  next(new HttpError(`The endpoint you requested (${req.originalUrl}) could not be found.`, 404));
});

// error handler
app.use(globalMiddlewareHandler);

export default app;
