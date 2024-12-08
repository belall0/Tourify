import mongoose, { mongo } from 'mongoose';
import slugify from 'slugify';
import HttpError from '../utils/httpError.js';

// UTILITY FUNCTIONS
const removeFields = function (doc, ret) {
  delete ret.id;
  delete ret.__v;
  delete ret.slug;
  delete ret.updatedAt;
  delete ret.createdAt;
};

// SCHEMA DEFINITION
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour name is required'],
      minLength: [3, 'tour name is too short. It must be at least 3 characters long.'],
      maxLength: [40, 'tour name is too long. It must be 40 characters or fewer.'],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    duration: {
      type: Number,
      required: [true, 'tour duration is required'],
      min: [1, 'tour duration is too short, it must be at least 1 day'],
      max: [100, 'tour duration is too long, it must be at most 100 days'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'tour maxGroupSize is required'],
      min: [1, 'tour maxGroupSize is too small, it must be at least 1 person'],
      max: [100, 'tour maxGroupSize is too large, it must be at most 100 people'],
    },

    difficulty: {
      type: String,
      required: [true, 'tour difficulty is required'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either: easy, medium, or difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 3,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'tour price is required'],
      min: [1, 'tour price is too low, it must be at least 1'],
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
      minLength: [10, 'tour summary is too short. It must be at least 10 characters long.'],
      maxLength: [150, 'tour summary is too long. It must be 150 characters or fewer.'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'tour imageCover is required'],
    },

    images: {
      type: [String],
    },

    startDates: {
      type: [Date],
    },

    startLocation: {
      type: {
        type: String,
        default: 'point',
        enum: ['point'],
      },

      coordinates: {
        type: [Number], // [latitude, longitude]
      },

      address: {
        type: String,
      },

      description: {
        type: String,
      },
    },

    locations: [
      {
        type: {
          type: String,
          default: 'point',
          enum: ['point'],
        },

        coordinates: {
          type: [Number], // [latitude, longitude]
        },

        address: {
          type: String,
        },

        description: {
          type: String,
        },

        day: {
          type: Number,
        },
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

// MIDDLEWARES
tourSchema.pre('save', async function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

tourSchema.pre('save', async function (next) {
  // Validate Guides IDs
  if (this.guides && this.guides.length > 0) {
    const existingGuides = await mongoose.model('User').find({ _id: { $in: this.guides } });

    if (existingGuides.length !== this.guides.length) {
      const existingGuidesIds = existingGuides.map((guide) => guide._id.toString());

      const missingGuides = this.guides.filter(
        (guideId) => !existingGuidesIds.includes(guideId.toString()),
      );

      return next(new HttpError(`No guide(s) found with id(s): ${missingGuides.join(', ')}`, 404));
    }
  }

  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name email -_id',
  });

  next();
});

// MODEL DEFINITION
const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
