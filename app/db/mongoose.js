import mongoose from 'mongoose'
import logger from '../config/logger.js'

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-db'

export async function connectToDB() {
  try {
    await mongoose.connect(mongoUri, {})
    logger.info('✅ Connected to MongoDB: ' + mongoUri)
  } catch (err) {
    logger.error(new Error('❌ Error connecting to MongoDB:', err.message))
    process.exit(1)
  }
}
