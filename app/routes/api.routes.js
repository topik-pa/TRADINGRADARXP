import express from 'express'
import {
  getStockBySlug,
  getStocks,
  getStocksAccents,
  getStocksPerformance
} from '../controllers/api.controller.js'
const router = express.Router()

const CURRENT_EXCHANGES = 'milan|oslo|paris|amsterdam|brussels|lisbon|dublin|global'
const ALPHABET = 'A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|Numbers'
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

// GET stocks by first letter
router.get(`/stocks/:letter(${ALPHABET})`, getStocks)

// GET stock by slug
router.get('/stocks/:slug', getStockBySlug)


// GET all stocks
router.get('/stocks/', getStocks)


export default router
