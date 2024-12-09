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
      minLength: [10, 'review is too short. It must be at least 10 characters long.'],
      maxLength: [80, 'review is too long. It must be 80 characters or fewer.'],
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
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// MODEL DEFINITION
const Review = mongoose.model('Review', reviewSchema);

export default Review;