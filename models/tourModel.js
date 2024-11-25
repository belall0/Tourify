import mongoose from 'mongoose';
import slugify from 'slugify';

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
        validator: function (value) {},
        message: 'Discount price ({VALUE}) should be below regular price value',
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
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
  },
);

tourSchema.pre('save', function async(next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

tourSchema.pre(
  ['updateOne', 'updateMany', 'findOneAndUpdate', 'findByIdAndUpdate'],
  function async(next) {
    const update = this.getUpdate();

    // if the name is being updated, update the slug as well
    if (update.name) {
      update.slug = slugify(update.name, { lower: true });
    }

    next();
  },
);

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
