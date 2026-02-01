import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript
export interface IDeal extends Document {
  title: string;
  description: string;
  category: string;
  accessLevel: 'public' | 'locked';
  partnerName: string;
  discountCode?: string;
}

// Deal-ish schema for the listings page.
// Originally tied to "Point 11" in the requirements doc.
// Leaving this note here so I remember why this exists later.
const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // feels obvious, but mongoose complains if you forget it
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    // Thought about an enum here, but categories tend to grow unexpectedly
  },
  // Frontend uses this to decide whether to show the lock icon 🔒
  accessLevel: {
    type: String,
    enum: ['public', 'locked'],
    default: 'public'
  },
  partnerName: {
    type: String,
    required: true
  },
  // This should ONLY be readable after a successful claim
  // select: false saves us from accidentally leaking it
  discountCode: {
    type: String,
    select: false
  }
  // Might come in handy later, commenting out for now
  // claimedCount: { type: Number, default: 0 }
}, {
  // I go back and forth on timestamps, 
  // but they usually end up useful
  timestamps: true
});

// Naming inconsistency (Deal vs dealSchema) is intentional-ish.
// Happens all the time in real codebases anyway.
const Deal = mongoose.model<IDeal>('Deal', dealSchema);

// Note to self: 
// If we ever add soft deletes or expiry dates, update this.
export default Deal;
