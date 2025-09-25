// backend/models/User.js
import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email format',
    }
  },
  password: {
    type: String,
    required: function() {
      return !this.appleId;
    },
  },
  appleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  fullName: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/,
  },
  authProvider: {
    type: String,
    enum: ['local', 'apple'],
    default: 'local',
  },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);