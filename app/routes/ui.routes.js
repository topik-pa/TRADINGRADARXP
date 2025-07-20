import express from 'express'
import { hpView, hpStock } from '../controllers/ui.controller.js'
const router = express.Router()

// Sitemap.xml
router.get('/sitemap.xml', (req, res) => {
  res.sendFile('/app/public/sitemap.xml', { root: '.' })
})
// Robots.txt
router.get('/robots.txt', (req, res) => {
  res.sendFile('/app/public/robots.txt', { root: '.' })
})
// favicon.ico
router.get('/favicon.ico', (req, res) => {
  res.sendFile('/app/public/favicon.ico', { root: '.' })
})

router.get('/:lang/:urlname', hpStock)
router.get('/:lang/', hpView)

router.get('/', (req, res) => {
  // Rileva lingua preferita dal browser
  const lang = req.acceptsLanguages('en', 'it') || 'en'
  // Reindirizza in modo permanente
  res.redirect(301, `/${lang}/`)
})

export default router
