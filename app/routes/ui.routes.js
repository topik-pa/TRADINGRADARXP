import express from 'express'
import {
  hpView,
  stockView,
  privacyView,
  contactsView,
  aboutView,
  exchangeView } from '../controllers/ui.controller.js'
const router = express.Router()

const CURRENT_EXCHANGES = 'milan|oslo|paris|amsterdam|brussels|lisbon|dublin|global'
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
router.get(`/:lang(${CURRENT_LANGS})/:exchange(${CURRENT_EXCHANGES})`, exchangeView)

// Privacy
router.get(`/:lang(${CURRENT_LANGS})/privacy`, privacyView)

// Contacts
router.get(`/:lang(${CURRENT_LANGS})/contacts`, contactsView)

// About
router.get(`/:lang(${CURRENT_LANGS})/about`, aboutView)

// Stock page
router.get(`/:lang(${CURRENT_LANGS})/:slug`, stockView)


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
