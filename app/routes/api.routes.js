import express from 'express'
import {
  getStockByStockUrl,
  /* getStockByISIN,*/
  getStocksByMarket,
  getStocks,
  getStocksAccents,
  getStocksAccentsByExchange
} from '../controllers/api.controller.js'
const router = express.Router()

const CURRENT_EXCHANGES = 'milan|oslo|paris|amsterdam|brussels|lisbon|dublin|global'

// GET all stocks accents
router.get('/stocks/accents', getStocksAccents)

// GET all stocks exchange accents
router.get('/stocks/accents/:exchange', getStocksAccentsByExchange)


// GET stocks by Exchange
router.get(`/stocks/:exchange(${CURRENT_EXCHANGES})`, getStocksByMarket)

// GET stock by ISIN
// router.get('/stocks/:isin', getStockByISIN)

// GET stock by url fragment
router.get('/stocks/:stockurl', getStockByStockUrl)

// GET all stocks
router.get('/stocks/', getStocks)


export default router
