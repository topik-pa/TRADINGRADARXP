import express from 'express'
import { hpView, stockView, stockViewTP, stockViewN, stockViewDividend, privacyView, ContactsView, exchangeView } from '../controllers/ui.controller.js'
const router = express.Router()

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



// exchange
router.get('/:lang(en|it)/:exchange(milano|paris)', exchangeView)



// stock page - dividend
router.get('/:lang(it|en)/:stockUrl/dividend', stockViewDividend)
// stock page - news
router.get('/:lang(it|en)/:stockUrl/news', stockViewN)
// stock page - target price
router.get('/:lang(it|en)/:stockUrl/target-price', stockViewTP)
// stock page
router.get('/:lang(it|en)/:stockUrl', stockView)


// privacy
router.get('/:lang(it|en)/privacy', privacyView)
// contacts
router.get('/:lang(it|en)/contacts', ContactsView)


// home page
router.get('/:lang(it|en)', hpView)


// root page
router.get('/', (req, res) => {
  // Rileva lingua preferita dal browser
  const lang = req.acceptsLanguages('en', 'it') || 'en'
  // Reindirizza in modo permanente
  res.redirect(301, `/${lang}/`)
})

export default router
