import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import HttpError from '../utils/httpError.js';

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    success(res, HttpStatus.CREATED, doc, Model.modelName.toLowerCase());
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. Initialize query
    let query = Model.find().setOptions({ skipPopulation: true }); // Skip population for performance

    // 2. Build query: filter, sort, paginate, select
    query = APIFeatures.filter(query, req.query);
    query = APIFeatures.sort(query, req.query);
    query = APIFeatures.paginate(query, req.query);
    query = APIFeatures.select(query, req.query);

    // 3. Execute query
    const docs = await query;

    // 4. Send response
    success(res, HttpStatus.OK, docs, Model.modelName.toLowerCase() + '(s)');
  });

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc)
      return next(
        new HttpError(`No ${Model.modelName.toLowerCase()} found with id: ${req.params.id}`, HttpStatus.NOT_FOUND),
      );

    success(res, HttpStatus.OK, doc, Model.modelName.toLowerCase());
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.findById(req.params.id).setOptions({ skipPopulation: true });
    if (!doc)
      return next(
        new HttpError(`No ${Model.modelName.toLowerCase()} found with id: ${req.params.id}`, HttpStatus.NOT_FOUND),
      );

    Object.assign(doc, req.body);
    doc = await doc.save(); // Save the updated tour to the database to trigger the pre-save middleware

    success(res, HttpStatus.OK, doc, Model.modelName.toLowerCase());
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(
        new HttpError(`No ${Model.modelName.toLowerCase()} found with id: ${req.params.id}`, HttpStatus.NOT_FOUND),
      );

    success(res, HttpStatus.NO_CONTENT);
  });
