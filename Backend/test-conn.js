import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
console.log('Using MONGODB_URI:', uri ? uri.replace(/:(.*)@/, ':****@') : uri);

const opts = { serverSelectionTimeoutMS: 5000 };

mongoose.connect(uri, opts)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection error:');
    console.error(err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    process.exit(1);
  });
