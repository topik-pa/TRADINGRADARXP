import mongoose from 'mongoose'

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-db'

export async function connectToDB() {
  try {
    await mongoose.connect(mongoUri, {})
    console.log('✅ Connected to MongoDB: ' + mongoUri)
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message)
    process.exit(1)
  }
}
