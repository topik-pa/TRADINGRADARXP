import express from 'express'
import { hpView, stockView, privacyView, ContactsView, exchangeView } from '../controllers/ui.controller.js'
const router = express.Router()

const CURRENT_EXCHANGES = 'milan|oslo|paris|amsterdam|brussels|lisbon|dublin'
const CURRENT_LANGS = 'it|en'


// sitemap.xml
router.get('/sitemap.xml', (req, res) => {
  res.sendFile('/public/sitemap.xml', { root: './app' })
})
// robots.txt
router.get('/robots.txt', (req, res) => {
  res.sendFile('/public/robots.txt', { root: './app' })
})
// favicon.ico
router.get('/favicon.ico', (req, res) => {
  res.sendFile('/public/favicon.ico', { root: './app' })
})


// Exchange
router.get(`/:lang(en|it)/:exchange(${CURRENT_EXCHANGES})`, exchangeView)


// Stock page
router.get(`/:lang(${CURRENT_LANGS})/:stockUrl`, stockView)


// Privacy
router.get(`/:lang(${CURRENT_LANGS})/privacy`, privacyView)
// Contacts
router.get(`/:lang(${CURRENT_LANGS})/contacts`, ContactsView)


// Home page
router.get(`/:lang(${CURRENT_LANGS})`, hpView)


// root page
router.get('/', (req, res) => {
  // Get browser prefered language
  const lang = req.acceptsLanguages('en', 'it') || 'en'
  // Redirects
  res.redirect(301, `/${lang}/`)
})

export default router
