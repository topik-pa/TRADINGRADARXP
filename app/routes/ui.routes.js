import express from 'express'
import { hpView } from '../controllers/ui.controller.js'
const router = express.Router()

router.get('/', hpView)

export default router