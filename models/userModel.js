import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import HttpError from '../utils/httpError.js';
import crypto from 'node:crypto';

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
      trim: true,
    },

    role: {
      type: String,
      default: 'user',
      enum: ['customer', 'operator', 'admin'],
    },

    photo: {
      type: String,
      default: 'default.jpg',
    },

    photoUrl: {
      type: String,
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
    },

    verificationCodeExpiry: {
      type: Date,
    },

    passwordUpdatedAt: {
      type: Date,
      default: undefined, // to ensure the field is not automatically set
    },

    passwordResetToken: {
      type: String,
      default: undefined,
    },

    passwordResetTokenExpiry: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('role') && this.role === 'admin') {
    return next(new HttpError('Admin role is not allowed', 400));
  }

  if (!this.isModified('password')) {
    return next();
  }

  if (!this.isNew) {
    this.passwordUpdatedAt = Date.now() - 1000; // to ensure the password is updated before the token is issued
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
  return JWTTimestamp < passwordChangedTime;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpiry = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailVerificationCode = function () {
  // 1. Generate a random 6-digit number
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  // 2. Set the account verification status to false
  this.isAccountVerified = false;

  // 3. Hash the number and save it to the user document
  this.verificationCode = crypto.createHash('sha256').update(verificationCode.toString()).digest('hex');

  // 4. set the expiry time for the verification code (e.g. 10 minutes)
  this.verificationCodeExpiry = Date.now() + 10 * 60 * 1000;

  return verificationCode;
};

const User = mongoose.model('User', userSchema);
export default User;
