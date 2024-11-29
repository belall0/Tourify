import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import HttpError from '../utils/httpError.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [50, 'Name must not exceed 50 characters'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters'],
      select: false,
      trim: true,
    },

    passwordUpdatedAt: {
      type: Date,
      default: undefined, // to ensure the field is not automatically set
      select: false,
    },

    photo: String,

    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'guide', 'lead-guide'],
    },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
  },
);

userSchema.pre('save', async function (next) {
  if (this.role === 'admin') {
    return next(new HttpError('Admin role is not allowed', 400));
  }

  if (!this.isModified('password')) {
    return next();
  }

  if (!this.isNew) {
    this.passwordUpdatedAt = Date.now();
  }

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.isPasswordCorrect = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.isPasswordUpdatedAfter = function (JWTTimestamp) {
  if (!this.passwordUpdatedAt) {
    return false;
  }

  const passwordChangedTime = parseInt(this.passwordUpdatedAt.getTime() / 1000); // convert to seconds to match JWTTimestamp
  // If JWT timestamp is less than password changed timestamp, it means password was changed after token was issued
  return JWTTimestamp <= passwordChangedTime;
};

const User = mongoose.model('User', userSchema);
export default User;
