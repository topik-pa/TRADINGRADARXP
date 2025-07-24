import express from 'express'
import { hpView, stockView, stockViewTP, stockViewN, stockViewDividend } from '../controllers/ui.controller.js'
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


// stock page - dividend
router.get('/:lang/:stockUrl/dividend', stockViewDividend)
// stock page - news
router.get('/:lang/:stockUrl/news', stockViewN)
// stock page - target price
router.get('/:lang/:stockUrl/target-price', stockViewTP)
// stock page
router.get('/:lang/:stockUrl', stockView)


// all the stocks index
// router.get('/:lang/stocks', stocksIndex)
// all the target prices and reccomendations
// router.get('/:lang/target-prices', hpView)
// all the dividends
// router.get('/:lang/dividends', hpView)


// home page
router.get('/:lang/{it|en}', hpView)

// root page
router.get('/', (req, res) => {
  // Rileva lingua preferita dal browser
  const lang = req.acceptsLanguages('en', 'it') || 'en'
  // Reindirizza in modo permanente
  res.redirect(301, `/${lang}/`)
})

export default router
