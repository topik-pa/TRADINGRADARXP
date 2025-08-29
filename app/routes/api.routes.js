import express from 'express'
import {
  getStockByStockUrl,
  /* getStockByISIN,*/
  getStocksByMarket,
  getStocks,
  getStocksAccents,
  getStocksAccentsByExchange,
  getStocksPerformance,
  getStocksPerformanceByExchange
} from '../controllers/api.controller.js'
const router = express.Router()

const CURRENT_EXCHANGES = 'milan|oslo|paris|amsterdam|brussels|lisbon|dublin|global'
const TREND = 'up|down'

// GET all stocks best performance 1M
router.get(`/stocks/performance/:trend(${TREND})`, getStocksPerformance)
// GET all stocks exchange performance 1M
router.get(`/stocks/performance/:exchange(${CURRENT_EXCHANGES})/:trend(${TREND})`, getStocksPerformanceByExchange)


// GET all stocks accents
router.get('/stocks/accents', getStocksAccents)

// GET all stocks exchange accents
router.get(`/stocks/accents/:exchange(${CURRENT_EXCHANGES})`, getStocksAccentsByExchange)


// GET stocks by Exchange
router.get(`/stocks/:exchange(${CURRENT_EXCHANGES})`, getStocksByMarket)

// GET stock by ISIN
// router.get('/stocks/:isin', getStockByISIN)

// GET stock by url fragment
router.get('/stocks/:stockurl', getStockByStockUrl)

// GET all stocks
router.get('/stocks/', getStocks)


export default router
