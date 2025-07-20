import express from 'express'
import { getStockByISIN, getStocks } from '../controllers/api.controller.js'
const router = express.Router()

router.get('/stocks/', getStocks)

router.get('/stocks/:isin', getStockByISIN)

export default router