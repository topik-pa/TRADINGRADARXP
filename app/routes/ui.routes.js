import express from 'express'
import { hpView, hpStock } from '../controllers/ui.controller.js'
const router = express.Router()

router.get('/', (req, res) => {
  // Rileva lingua preferita dal browser
  const lang = req.acceptsLanguages('en', 'it') || 'en'
  // Reindirizza in modo permanente
  res.redirect(301, `/${lang}/`)
})

router.get('/:lang/stocks/:isin', hpStock)
router.get('/:lang/', hpView)

export default router
