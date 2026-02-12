import { Stock } from '../models/Stock.js'
const ACCENT = 5

// GET all stocks performance 1M
export async function getStocksPerformance(req, res, next) {
  const trend = req.params.trend === 'up' ? -1 : 1
  const exchange = req.params.exchange
  const query = { perf1M: { $exists: true, $ne: null } }
  if (exchange) {
    const re = new RegExp(exchange, 'i')
    query.market = re
  }
  let stocks = []
  try {
    stocks = await Stock.find(query).sort({ perf1M: trend }).limit(20)
  } catch (error) {
    return next(error)
  }
  return res.json(stocks)
}


// GET all stocks exchange accents
export async function getStocksAccents(req, res, next) {
  const exchange = req.params.exchange
  const query = { relVariation: { $exists: true, $ne: null } }
  if (exchange) {
    const re = new RegExp(exchange, 'i')
    query.market = re
  }
  let stocks = []
  try {
    stocks = await Stock.find({
      $and: [
        query,
        { $or: [
          { relVariation: { $gt: ACCENT } },
          { relVariation: { $lt: -ACCENT } }
        ] }
      ]
    }).sort({ relVariation: -1 })
  } catch (error) {
    return next(error)
  }
  return res.json(stocks)
}


// GET stocks
export async function getStocks(req, res, next) {
  const exchange = req.params.exchange
  const letter = req.params.letter
  const query = {}
  if (exchange) {
    const re = new RegExp(exchange, 'i')
    query.market = re
  }
  if (letter) {
    if(letter === 'numbers') {
      const re = new RegExp('^\\d.*')
      query.name = re
    } else {
      const re = new RegExp('^' + letter, 'i')
      query.name = re
    }
  }
  let stocks = []
  try {
    stocks = await Stock.find(query)
  } catch (error) {
    return next(error)
  }
  return res.json(stocks)
}


// GET stock by slug
export async function getStockBySlug(req, res, next) {
  const slug = req.params.slug
  let stock
  try {
    stock = await Stock.findOne({ slug })
  } catch (error) {
    return next(error)
  }
  if (!stock) return res.status(404).json({
    error: 404,
    message: 'Resource not found'
  })
  return res.json(stock)
}


/* Alcuni suggerimenti da cgpt export const getStocks = async (req, res) => {
  const stocks = await Stock.find()
  res.json(stocks)
}
export const getStockById = async (req, res) => {
  const stock = await Stock.findById(req.params.id)
  if (!stock) return res.status(404).json({ message: 'Not found' })
  res.json(stock)
}
export const createStock = async (req, res) => {
  const newStock = new Stock(req.body)
  await newStock.save()
  res.status(201).json(newStock)
}
export const updateStock = async (req, res) => {
  const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!stock) return res.status(404).json({ message: 'Not found' })
  res.json(stock)
}
export const deleteStock = async (req, res) => {
  const result = await Stock.findByIdAndDelete(req.params.id)
  if (!result) return res.status(404).json({ message: 'Not found' })
  res.json({ message: 'Deleted' })
}*/
