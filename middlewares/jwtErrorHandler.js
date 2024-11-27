import HttpError from '../utils/httpError.js';

export const handleJWTError = (err) => {
  return new HttpError('Invalid token. Please log in again', 401);
};

export const handleJWTExpiredError = (err) => {
  return new HttpError('Your token has expired. Please log in again', 401);
};
