import 'dotenv/config'
import express from 'express'
import cron from 'node-cron'
import logger from './app/config/logger.js'

import { connectToDB } from './app/db/mongoose.js'
import { initDB } from './app/db/initDB.js'
// eslint-disable-next-line no-unused-vars
import { feedDB } from './app/db/feedDB.js'
import apiRoutes from './app/routes/api.routes.js'
import uiRoutes from './app/routes/ui.routes.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { I18n } from 'i18n'
import compression from 'compression'

// Emula __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 8080

// Parse application/json
app.use(express.json())

// Compress responses if browser is capable
app.use(compression({ filter: shouldCompress }))
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}

const i18n = new I18n({
  locales: ['en', 'it'],
  directory: path.join(__dirname, 'app', 'locales'),
  defaultLocale: 'en',
  queryParameter: 'lang',
  autoReload: true,
  updateFiles: false,
  objectNotation: true
})
app.use((req, res, next) => {
  i18n.init(req, res)
  next()
})

app.use('/styles', express.static(path.join(__dirname, 'app', 'styles')))
app.use('/assets', express.static(path.join(__dirname, 'app', 'assets')))
app.use('/views', express.static(path.join(__dirname, 'app', 'views')))
app.use('/scripts', express.static(path.join(__dirname, 'app', 'scripts')))
app.use('/dist', express.static(path.join(__dirname, 'app', 'dist')))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'app', 'views'))


//Routes
app.use('/api', apiRoutes)
app.use('/', uiRoutes)
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

export { app, i18n }
