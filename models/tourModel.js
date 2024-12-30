import mongoose from 'mongoose';
import slugify from 'slugify';
import HttpError from '../utils/httpError.js';

// Remove fields when retrieving data from the database
const removeFields = function (doc, ret) {
  delete ret.id;
  delete ret.__v;
  delete ret.slug;
  delete ret.updatedAt;
  delete ret.createdAt;
};

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      minLength: [3, 'Too short (min 3)'],
      maxLength: [40, 'Too long (max 40)'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Max group size is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    priceDiscount: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message: `Discount price ({VALUE}) should be below the regular price`,
      },
    },
    summary: {
      type: String,
      required: [true, 'tour summary is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Image Cover is required'],
    },
    images: [String],
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'point',
        enum: ['point'],
      },
      coordinates: [Number], // [latitude, longitude]
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'point',
          enum: ['point'],
        },

        coordinates: [Number], // [latitude, longitude]
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false, transform: removeFields },
    toObject: { virtuals: true, versionKey: false, transform: removeFields },
  },
);

tourSchema.pre('save', async function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

tourSchema.pre(/^find/, function (next) {
  // Skip population if the query options specify to do so
  if (this.options.skipPopulation) {
    return next();
  }

  this.populate({
    path: 'guides',
    select: 'name email photo role -_id',
  });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
