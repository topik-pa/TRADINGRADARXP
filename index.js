import 'dotenv/config'
import express from 'express'
import logger from './app/config/logger.js'

import { connectToDB } from './app/db/mongoose.js'
import { dailyUpdateDB } from './app/db/dailyUpdateDB.js'

const app = express()
const port = process.env.PORT || 8080

// Parse application/json
app.use(express.json())

// Connect to DB
await connectToDB()
await dailyUpdateDB()

//Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the tradingradar XP project' })
})

app.use((req, res) => {
  res.status(404).json({
    error: 404,
    message: 'Resource not found'
  })
})

app.listen(port, () => {
  logger.info(`🚀 Server is running on port ${port} in ${process.env.NODE_ENV} mode.`)
})
