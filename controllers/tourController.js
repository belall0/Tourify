import Tour from '../models/tourModel.js';
import * as factory from './handlerFactory.js';

export const createTour = factory.createOne(Tour);
export const getAllTours = factory.getAll(Tour);
export const getTour = factory.getOne(Tour);
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);
