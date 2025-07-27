import express from 'express'
import { getStockByISIN, getStocksByMarket, getStocks } from '../controllers/api.controller.js'
const router = express.Router()

const CURRENT_EXCHANGES = 'milan|oslo|paris|amsterdam|brussels|lisbon|dublin'

// GET stocks by Exchange
router.get(`/stocks/:exchange(${CURRENT_EXCHANGES})`, getStocksByMarket)

// GET stock by ISIN
router.get('/stocks/:isin', getStockByISIN)

// GET all stocks
router.get('/stocks/', getStocks)


export default router
