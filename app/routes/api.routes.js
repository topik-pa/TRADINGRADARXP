import express from 'express'
import {
  getStockBySlug,
  getStocks,
  getStocksAccents,
  getStocksPerformance
} from '../controllers/api.controller.js'
const router = express.Router()

const CURRENT_EXCHANGES = 'milan|oslo|paris|amsterdam|brussels|lisbon|dublin|global'
const TRENDS = 'up|down'

// GET all stocks exchange performance 1M
router.get(`/stocks/performance/:exchange(${CURRENT_EXCHANGES})/:trend(${TRENDS})`, getStocksPerformance)
// GET all stocks best performance 1M
router.get(`/stocks/performance/:trend(${TRENDS})`, getStocksPerformance)


// GET all stocks exchange accents
router.get(`/stocks/accents/:exchange(${CURRENT_EXCHANGES})`, getStocksAccents)
// GET all stocks accents
router.get('/stocks/accents', getStocksAccents)


// GET stocks by exchange
router.get(`/stocks/:exchange(${CURRENT_EXCHANGES})`, getStocks)


// GET stock by url fragment
router.get('/stocks/:stockurl', getStockBySlug)


// GET all stocks
router.get('/stocks/', getStocks)


export default router
