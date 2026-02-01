import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import Deal from './models/Deal'; 

// Pull in env stuff early — I *always* forget this otherwise
dotenv.config()

async function seedDeals() {
  let mongoUri: string

  try {
    // ---- DB CONNECTION ----
    if (!process.env.MONGO_URI) {
      throw new Error('Missing MONGO_URI in environment variables')
    }

    // TS needs this to be explicitly a string
    mongoUri = process.env.MONGO_URI

    await mongoose.connect(mongoUri)
    console.log('🌱 DB connected, starting seed script...')

    // ---- CLEAN SLATE ----
    // Easier to reason about than partial deletes
    await Deal.deleteMany({})
    console.log('🧹 Existing deals removed')

    // ---- FAKE DATA ----
    // Inline for now — if this grows, we’ll clean it up later
    const fakeDeals = [
      {
        title: 'AWS Activate Credits',
        description:
          'Get $10,000 in AWS credits for 2 years. Valid for new startups only.',
        category: 'Infrastructure',
        accessLevel: 'locked',
        partnerName: 'Amazon Web Services',
        discountCode: 'AWS-STARTUP-2026-XYZ', // yeah… totally fake
      },
      {
        title: 'Notion Plus - 6 Months Free',
        description:
          'Organize your startup with Notion. Unlimited blocks and AI features.',
        category: 'Productivity',
        accessLevel: 'public',
        partnerName: 'Notion',
        discountCode: 'NOTION-LOVE-STARTUPS',
      },
      {
        title: 'Stripe Fee Waiver',
        description: '$50,000 in fee-free processing for your first year.',
        category: 'Finance',
        accessLevel: 'locked',
        partnerName: 'Stripe',
        discountCode: 'STRIPE-ZERO-FEES',
      },
      {
        title: 'Linear Standard Plan',
        description: 'Streamline your issue tracking. Free for 12 months.',
        category: 'Productivity',
        accessLevel: 'public',
        partnerName: 'Linear',
        discountCode: 'LINEAR-ROCKS',
      },
    ]

    await Deal.insertMany(fakeDeals)
    console.log(`✅ Seeded ${fakeDeals.length} deals`)

  } catch (err) {
    console.error('❌ Deal seeding failed')
    console.error(err)
    process.exit(1)
  } finally {
    // Always disconnect — even if things blow up
    try {
      await mongoose.disconnect()
      console.log('👋 DB connection closed')
    } catch {
      console.warn('⚠️ Could not close DB connection cleanly')
    }
  }
}

// Run it
seedDeals()
// Might turn this into a CLI script later if needed