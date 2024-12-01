import mongoose from 'mongoose';

let db: typeof mongoose;

declare global {
  var __db: typeof mongoose | undefined;
}

if (process.env.NODE_ENV === 'production') {
  db = await mongoose.connect('mongodb://mongodb:27017/jobboard');
} else {
  if (!global.__db) {
    global.__db = await mongoose.connect('mongodb://mongodb:27017/jobboard');
  }
  db = global.__db;
}

export { db };
