import express from 'express'
import { hpView } from '../controllers/ui.controller.js'
const router = express.Router()

router.get('/', (req, res) => {
  // Rileva lingua preferita dal browser
  const lang = req.acceptsLanguages('en', 'it') || 'en'
  // Reindirizza in modo permanente
  res.redirect(301, `/${lang}/`)
})

router.get('/:lang/', hpView)

export default router
