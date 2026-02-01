import mongoose, { Schema, Document } from 'mongoose';

// Interface to satisfy TypeScript (Keeps the red lines away)
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  isVerified: boolean;
  role: 'founder' | 'indie_hacker';
  claimedDeals: mongoose.Types.ObjectId[];
}

// User model
// Mostly founders / indie hackers.
// isVerified is important because unverified users
// can't claim locked deals (see product spec).
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    // password hashing handled elsewhere (middleware)
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['founder', 'indie_hacker'], // must be strings
    default: 'founder' // most users start here anyway
  },
  // Track deals a user has already claimed so we don't allow duplicates.
  // Not super optimized, but works fine for now.
  claimedDeals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal' // ref must be a string (model name)
  }],
}, {
  timestamps: true // explicit timestamps are useful
});

// Keeping this boring and obvious on purpose
// The "mongoose.models.User ||" part helps if we ever switch to serverless later
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;

