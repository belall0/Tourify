import mongoose from 'mongoose';

// UTILITY FUNCTIONS
const removeFields = function (doc, ret) {
  delete ret.id;
  delete ret.__v;
  delete ret.updatedAt;
  delete ret.createdAt;
};

// SCHEMA DEFINITION
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'review cannot be empty'],
      trim: true,
    },

    rating: {
      type: Number,
      require: [true, 'review must have a rating'],
      min: [1, 'rating must be above 1.0'],
      max: [5, 'rating must be below 5.0'],
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false, transform: removeFields },
    toObject: { virtuals: true, versionKey: false, transform: removeFields },
  },
);

reviewSchema.pre(/^find/, function (next) {
  // Skip population if the query options specify to do so
  if (this.options.skipPopulation) {
    return next();
  }

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// MODEL DEFINITION
const Review = mongoose.model('Review', reviewSchema);

export default Review;
