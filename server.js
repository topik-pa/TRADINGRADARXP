import 'dotenv/config'
import express from 'express'
import cron from 'node-cron'
import { connectToDB } from './app/db/mongoose.js'
import { setDynamicData } from './app/db/setDynamicData.js'
import apiRoutes from './app/routes/api.routes.js'
import uiRoutes from './app/routes/ui.routes.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { I18n } from 'i18n'
import compression from 'compression'

// Emulates __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

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

// Set custom headers
app.use(function(req, res, next) {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  res.setHeader('Upgrade-insecure-requests', '1')
  res.setHeader('Content-Security-Policy', 'default-src \'none\'; script-src https://www.statcounter.com/ \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' https://c.statcounter.com/ https://tracking.avapartner.com; object-src \'none\'; frame-src https://tracking.avapartner.com/ https://c.statcounter.com/ \'self\'; form-action \'self\'; font-src \'self\'; media-src \'self\'; connect-src https://c.statcounter.com/ \'self\'; frame-ancestors \'none\'; base-uri \'none\'')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  next()
})

// HTTPS redirect server-side
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url)
    } else { return next() }
  } else { return next() }
})

// FROM www. TO not www.
function wwwRedirect(req, res, next) {
  if (req.headers.host.slice(0, 4) === 'www.') {
    const newHost = req.headers.host.slice(4)
    return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl)
  }
  next()
};
app.set('trust proxy', true)
app.use(wwwRedirect)

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

// Connect to DB
if (process.env.NODE_ENV !== 'test') {
  await connectToDB()
}
// INIT DB
if (process.env.NODE_ENV === 'development') {
  // await setDynamicData()
  // await setDynamicData(1, 1)
} else {
  cron.schedule(process.env.CRON_SCHEDULE_FIRSTOFDAY, async() => {
    await setDynamicData(1, 1)
  })
  cron.schedule(process.env.CRON_SCHEDULE_INTRADAY, async() => {
    await setDynamicData(0, 1)
  })
  cron.schedule(process.env.CRON_SCHEDULE_LASTOFDAY, async() => {
    await setDynamicData(0, 0)
  })
}

export { app, i18n }
