import Review from '../models/reviewModel.js';
import * as factory from './handlerFactory.js';

export const createReview = factory.createOne(Review);
export const getAllReviews = factory.getAll(Review);
export const getReview = factory.getOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
