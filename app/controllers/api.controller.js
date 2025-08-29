import { Stock } from '../models/Stock.js'
const ACCENT = 2

// GET all stocks best performance 1M
export async function getStocksPerformance(req, res, next) {
  const trend = req.params.trend === 'up' ? -1 : 1
  let stocks = []
  try {
    stocks = await Stock.find({}).sort({ perf1M: trend }).limit(10)
  } catch (error) {
    return next(error)
  }
  return res.json(stocks)
}
// GET all stocks exchange performance 1M
export async function getStocksPerformanceByExchange(req, res, next) {
  const trend = req.params.trend === 'up' ? -1 : 1
  const exchange = req.params.exchange
  const re = new RegExp(exchange, 'i')
  let stocks = []
  try {
    stocks = await Stock.find({ market: re }).sort({ perf1M: trend }).limit(10)
  } catch (error) {
    return next(error)
  }
  return res.json(stocks)
}


// GET all stocks accents
export async function getStocksAccents(req, res, next) {
  let stocks = []
  try {
    stocks = await Stock.find({
      $or: [
        { relVariation: { $gt: ACCENT } },
        { relVariation: { $lt: -ACCENT } }
      ]
    }).sort({ relVariation: -1 })
  } catch (error) {
    return next(error)
  }
  return res.json(stocks)
}

// GET all stocks exchange accents
export async function getStocksAccentsByExchange(req, res, next) {
  const exchange = req.params.exchange
  const re = new RegExp(exchange, 'i')
  let stocks = []
  try {
    stocks = await Stock.find({
      $and: [
        { market: re },
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

// GET all stocks
export async function getStocks(req, res, next) {
  let stocks = []
  try {
    stocks = await Stock.find({})
  } catch (error) {
    return next(error)
  }
  return res.json(stocks)
}

// GET stocks by Market
export async function getStocksByMarket(req, res, next) {
  const exchange = req.params.exchange
  const re = new RegExp(exchange, 'i')
  let stocks = []
  try {
    stocks = await Stock.find({ market: re })
  } catch (error) {
    return next(error)
  }
  return res.json(stocks)
}

// GET stock by ISIN
// export async function getStockByISIN(req, res, next) {
//   const isin = req.params.isin
//   let stock
//   try {
//     stock = await Stock.findOne({ isin: isin })
//   } catch (error) {
//     return next(error)
//   }
//   if (!stock) return res.status(404).json({
//     error: 404,
//     message: 'Resource not found'
//   })
//   return res.json(stock)
// }

// GET stock by stockUrl
export async function getStockByStockUrl(req, res, next) {
  const stockUrl = req.params.stockurl
  let stock
  try {
    stock = await Stock.findOne({ stockUrl: stockUrl })
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
