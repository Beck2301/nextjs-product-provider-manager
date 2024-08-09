import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached: mongoose.Mongoose | null = null;
let promise: Promise<mongoose.Mongoose> | null = null;

async function connectToDatabase(): Promise<mongoose.Mongoose> {
  if (cached) return cached;

  if (!promise) {
    promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      cached = mongoose;
      return mongoose;
    });
  }

  return promise;
}

export default connectToDatabase;
