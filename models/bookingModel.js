import mongoose from 'mongoose';

// Remove fields when retrieving data from the database
const removeFields = function (doc, ret) {
  delete ret.id;
  delete ret.__v;
  delete ret.updatedAt;
  delete ret.createdAt;
};

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User!'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a Tour!'],
    },

    slots: {
      type: Number,
      required: [true, 'Booking must have slots!'],
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Booking must have a total price!'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false, transform: removeFields },
    toObject: { virtuals: true, versionKey: false, transform: removeFields },
  },
);

bookingSchema.pre(/^find/, function (next) {
  if (this.options.skipPopulation) {
    return next();
  }

  if (this.options.populateUser) {
    console.log('populating user');
    this.populate({
      path: 'user',
      select: '_id name email',
    });

    return next();
  }

  this.populate('user')
    .populate({
      path: 'tour',
      select: 'name',
    })
    .populate({
      path: 'user',
      select: 'name email',
    });

  next();
});

// indexing the booking schema to prevent duplicate bookings
bookingSchema.index({ tour: 1, user: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
