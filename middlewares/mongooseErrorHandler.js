import HttpError from '../utils/httpError.js';

export const handleDBCastError = (err) => {
  const message = `Invalid ${err.path} value: ${err.value}`;
  return new HttpError(message, 400);
};

export const handleDBDuplicateFields = (err) => {
  const { keyValue } = err;
  const property = Object.keys(keyValue)[0];
  const value = keyValue[property];

  const message = `Duplicate value for ${property}: '${value}'`;
  return new HttpError(message, 400);
};

export const handleDBValidationError = (err) => {
  const errorMessages = Object.values(err.errors)
    .reverse()
    .map((err, indx) => {
      const { message } = err;
      return `${indx + 1}) ${message}`;
    });

  return new HttpError(errorMessages.join('. '), 400);
};
