import * as mongooseErrorHandler from './mongooseErrorHandler.js';
import * as jwtErrorHandler from './jwtErrorHandler.js';
const ENV = process.env.NODE_ENV;
// DONE:
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// DONE:
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // don't send error details in production
  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'something went wrong, please try again later',
  });
};

// DONE:
const globalMiddlewareHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (ENV === 'development') {
    sendErrorDev(err, res);
  } else if (ENV === 'production' || ENV === 'test') {
    // handle Mongoose errors
    if (err.name === 'CastError') err = mongooseErrorHandler.handleDBCastError(err);
    if (err.name === 'ValidationError') err = mongooseErrorHandler.handleDBValidationError(err);
    if (err.code === 11000) err = mongooseErrorHandler.handleDBDuplicateFields(err);

    // handle JsonWebTokenError
    if (err.name === 'JsonWebTokenError') err = jwtErrorHandler.handleJWTError(err);
    if (err.name === 'TokenExpiredError') err = jwtErrorHandler.handleJWTExpiredError(err);

    sendErrorProd(err, res);
  }
};

export default globalMiddlewareHandler;
