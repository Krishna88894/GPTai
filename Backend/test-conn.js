import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
console.log('Using MONGODB_URI:', uri ? uri.replace(/:(.*)@/, ':****@') : uri);

const dbName = resolveMongoDbName(uri);
const opts = { serverSelectionTimeoutMS: 5000 };
if (dbName) {
  opts.dbName = dbName;
}

mongoose.connect(uri, opts)
  .then(() => {
    console.log(`Connected to MongoDB successfully${dbName ? ` (${dbName})` : ''}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection error:');
    console.error(err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    process.exit(1);
  });

function resolveMongoDbName(mongoUri) {
  if (process.env.MONGODB_DB_NAME) {
    return process.env.MONGODB_DB_NAME;
  }

  if (!mongoUri) {
    return undefined;
  }

  try {
    const parsedUri = new URL(mongoUri);
    const hasExplicitDbName = parsedUri.pathname && parsedUri.pathname !== '/';
    if (hasExplicitDbName) {
      return undefined;
    }
  }
  catch {
    return undefined;
  }

  return process.env.NODE_ENV === 'production' ? 'gptai_prod' : 'gptai_local';
}
