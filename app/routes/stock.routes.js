import express from 'express'
import { getStockByISIN } from '../controllers/api.stock.controller.js'
const router = express.Router()

router.get('/:isin', getStockByISIN)

export default router