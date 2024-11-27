import jwt from 'jsonwebtoken';
import HttpError from '../utils/httpError.js';
import { HttpStatus } from '../utils/responseHandler.js';

export const generateToken = (id) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    throw new HttpError('JWT_SECRET or JWT_EXPIRES_IN not found', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
