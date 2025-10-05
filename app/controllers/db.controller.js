import { Stock } from '../models/Stock.js'
import logger from '../config/logger.js'

export async function createStock(data) {
  try {
    const stock = new Stock(data)
    const savedStock = await stock.save()
    return savedStock
  } catch (err) {
    logger.error(new Error(`Error saving stock:\n${err}`))
    throw err
  }
}

export async function readStock(isin) {
  try {
    const stock = await Stock.findOne({ isin })
    return stock
  } catch (err) {
    logger.error(new Error(`Error during read stock:\n${err}`))
    throw err
  }
}

export async function getStockBySlug(slug) {
  try {
    const stock = await Stock.findOne({ slug })
    return stock
  } catch (err) {
    logger.error(new Error(`Error during get stock:\n${err}`))
    throw err
  }
}

export async function upsertStock(data) {
  try {
    const filter = { isin: data.isin }
    const update = { ...data }
    const options = {
      new: true,       // ritorna il documento aggiornato
      upsert: true,    // crea se non esiste
      runValidators: true // applica le validazioni dello schema
    }
    const stock = await Stock.findOneAndUpdate(filter, update, options)
    return stock
  } catch (err) {
    logger.error(new Error(`Error during upsert stock:\n${err}`))
    throw err
  }
}
