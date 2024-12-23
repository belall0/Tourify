import * as mongooseErrorHandler from './mongooseErrorHandler.js';
import * as jwtErrorHandler from './jwtErrorHandler.js';
const ENV = process.env.NODE_ENV;

const sendErrorDev = (err, req, res) => {
  // if the error is from the API endpoint, send the error as JSON
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // else, render the error page
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  console.log(`a77777777a`);
  console.log(err);
  if (req.originalUrl.startsWith('/api')) {
    // json response
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
  } else {
    // render error page
    console.log(`it gets closssssssssse`);
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        status: err.status,
        message: err.message,
      });
    }

    // don't send error details in production
    res.status(500).render('error', {
      status: 'error',
      message: 'something went wrong, please try again later',
    });
  }
};

const globalMiddlewareHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (ENV === 'production' || ENV === 'test') {
    // handle Mongoose errors
    if (err.name === 'CastError') err = mongooseErrorHandler.handleDBCastError(err);
    if (err.name === 'ValidationError') err = mongooseErrorHandler.handleDBValidationError(err);
    if (err.code === 11000) err = mongooseErrorHandler.handleDBDuplicateFields(err);

    // handle JsonWebTokenError
    if (err.name === 'JsonWebTokenError') err = jwtErrorHandler.handleJWTError(err);
    if (err.name === 'TokenExpiredError') err = jwtErrorHandler.handleJWTExpiredError(err);

    sendErrorProd(err, req, res);
  }
};

export default globalMiddlewareHandler;
