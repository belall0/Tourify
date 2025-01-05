import mongoose from 'mongoose';

const removeFields = function (doc, ret) {
  delete ret.id;
  delete ret.__v;
  delete ret.slug;
  delete ret.updatedAt;
  delete ret.createdAt;
};

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false, transform: removeFields },
    toObject: { virtuals: true, versionKey: false, transform: removeFields },
  },
);

// populate the user when the review is queried
reviewSchema.pre(/^find/, function (next) {
  if (this.options && this.options.populateUser) {
    this.populate({
      path: 'user',
      select: 'name',
    });
  } else if (this.options && this.options.populateTour) {
    this.populate({
      path: 'tour',
      select: '_id name',
    });
  }

  next();
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
