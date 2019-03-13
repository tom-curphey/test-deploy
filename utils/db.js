import mongoose from 'mongoose';
import dbConnect from '../config';

export const connect = (url = dbConnect) => {
  return mongoose.connect(url, { useNewUrlParser: true });
};
