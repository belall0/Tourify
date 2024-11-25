import * as mongooseErrorHandler from './mongooseErrorHandler.js';
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  // handle mongoose CastError
  if (err.name === 'CastError') {
    err = mongooseErrorHandler.handleMongooseCastError(err);
  }

  // handle mongoose duplicate fields
  if (err.code === 11000) {
    err = mongooseErrorHandler.handleMongooseDuplicateFields(err);
  }

  // handle mongoose validation error
  if (err.name === 'ValidationError') {
    err = mongooseErrorHandler.handleMongooseValidationError(err);
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // don't send error details in production
  res.status(500).json({
    status: 'error',
    message: 'something went wrong, please try again later',
  });
};

const globalMiddlewareHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};

export default globalMiddlewareHandler;
