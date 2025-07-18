import { Stock } from '../models/Stock.js'

// GET stock by ISIN
export async function getStockByISIN(req, res, next) {
  const isin = req.params.isin
  let stock
  try {
    stock = await Stock.findOne({ isin: isin })
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