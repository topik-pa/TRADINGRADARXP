import express from 'express'
import { getStockByISIN, getStocks } from '../controllers/api.stock.controller.js'
const router = express.Router()

router.get('/', getStocks)

router.get('/:isin', getStockByISIN)

export default router