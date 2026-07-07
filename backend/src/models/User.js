import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  avatar: {
    type: String,
    default: 'https://api.dicebear.com/7.x/adventurer/svg?seed=default',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.post('save', async function(doc) {
  try {
    const data = doc.toObject();
    data._id = doc._id.toString();
    await UserMock.createWithId(data);
  } catch (err) {
    console.error('Failed to sync saved User to mock-db:', err);
  }
});

userSchema.post('findOneAndUpdate', async function(res) {
  if (res) {
    try {
      const data = res.toObject();
      data._id = res._id.toString();
      await UserMock.createWithId(data);
    } catch (err) {
      console.error('Failed to sync updated User to mock-db:', err);
    }
  }
});

import { UserMock } from '../config/mockDb.js';

const MongooseUser = mongoose.model('User', userSchema);

export const User = new Proxy(MongooseUser, {
  get(target, prop, receiver) {
    if (mongoose.connection.readyState !== 1) {
      if (prop in UserMock) {
        return UserMock[prop];
      }
    }
    return Reflect.get(target, prop, receiver);
  }
});
