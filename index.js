import 'dotenv/config'
import express from 'express'
import cron from 'node-cron'
import logger from './app/config/logger.js'

import { connectToDB } from './app/db/mongoose.js'
import { initDB } from './app/db/initDB.js'
// eslint-disable-next-line no-unused-vars
import { feedDB } from './app/db/feedDB.js'
import stockRoutes from './app/routes/stock.routes.js'

const app = express()
const port = process.env.PORT || 8080

// Parse application/json
app.use(express.json())

//Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the tradingradar XP project' })
})
app.use('/api/stock', stockRoutes)
// 404 handling
app.use((req, res) => {
  res.status(404).send({
    error: 404,
    message: 'Resource not found'
  })
})
// 500 handling
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  return res.status(err.status || 500).send({
    error: err.status || 500,
    message: err.message
  })
})

app.listen(port, () => {
  logger.info(`🚀 Server is running on port ${port} in ${process.env.NODE_ENV} mode.`)
})

// Connect to DB
if (process.env.NODE_ENV !== 'test') {
  await connectToDB() 
}
// INIT DB
if (process.env.NODE_ENV === 'development') {
  // await initDB()
  // await feedDB()
} else {
  cron.schedule(process.env.CRON_SCHEDULE_DB_UPDATE, async() => {
    await initDB()
  })
}

export default app