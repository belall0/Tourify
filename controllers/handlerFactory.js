import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import { HttpStatus, success } from '../utils/responseHandler.js';
import HttpError from '../utils/httpError.js';

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Add owner field to the request body if the model is 'Tour'
    if (Model.modelName.toLowerCase() === 'tour') req.body.owner = req.user.id;

    const doc = await Model.create(req.body);
    success(res, HttpStatus.CREATED, doc, Model.modelName.toLowerCase());
  });

export const getAll = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const { filterObj = {}, populate = false } = options;
    // 1. Initialize query
    let query = Model.find(filterObj).setOptions({ skipPopulation: !populate }); // Skip population for performance

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

export const getOne = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const { populateOptions } = options;

    const query = Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);

    const doc = await query;
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

    // Check ownership of the resource before updating if it is a 'Tour'
    if (Model.modelName.toLowerCase() === 'tour' && doc.owner.toString() !== req.user.id)
      return next(
        new HttpError(`You are not authorized to modify this ${Model.modelName.toLowerCase()}`, HttpStatus.FORBIDDEN),
      );

    Object.assign(doc, req.body);
    doc = await doc.save(); // Save the updated tour to the database to trigger the pre-save middleware

    success(res, HttpStatus.OK, doc, Model.modelName.toLowerCase());
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1. Find document by id
    const doc = await Model.findById(req.params.id).setOptions({ skipPopulation: true });
    if (!doc)
      return next(
        new HttpError(`No ${Model.modelName.toLowerCase()} found with id: ${req.params.id}`, HttpStatus.NOT_FOUND),
      );

    // 2. Check ownership of the resource before deleting if it is a 'Tour'
    if (Model.modelName.toLowerCase() === 'tour' && doc.owner.toString() !== req.user.id && req.user.role !== 'admin')
      return next(
        new HttpError(`You are not authorized to delete this ${Model.modelName.toLowerCase()}`, HttpStatus.FORBIDDEN),
      );

    // 3. Delete document
    await doc.deleteOne();

    // 4. Send response
    success(res, HttpStatus.NO_CONTENT);
  });
