import express from 'express'
import { Stock } from '../models/Stock.js'
import {
  hpView,
  stockView,
  privacyView,
  contactsView,
  aboutView,
  exchangeView } from '../controllers/ui.controller.js'
const router = express.Router()

const BASE_URL = 'https://rallyingstocks.com'
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const CURRENT_EXCHANGES = 'milan|oslo|paris|amsterdam|brussels|lisbon|dublin|global'
const CURRENT_LANGS = 'it|en'

// sitemap.xml
router.get('/sitemap-index.xml', (req, res) => {
  const sitemapIndex = `
    <?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>${BASE_URL}/sitemap.xml</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
      ${LETTERS.map(letter => `
        <sitemap>
          <loc>${BASE_URL}/sitemap-${letter.toLowerCase()}.xml</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
      `).join('')}
    </sitemapindex>`

  res.header('Content-Type', 'application/xml')
  res.send(sitemapIndex.trim())
})
router.get('/sitemap-:letter([A-Z]).xml', async(req, res) => {
  const { letter } = req.params
  const stocks = await Stock.find({ name: { $regex: `^${letter}`, $options: 'i' } })
  const xml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${stocks.map(stock => `
      <url>
        <loc>${BASE_URL}/it/${stock.slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>hourly</changefreq>
      </url>
      <url>
        <loc>${BASE_URL}/en/${stock.slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>hourly</changefreq>
      </url>
    `).join('')}
  </urlset>`

  res.header('Content-Type', 'application/xml')
  res.send(xml.trim())
})
router.get('/sitemap.xml', (req, res) => {
  res.sendFile('app/public/sitemap.xml', { root: '.' })
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
