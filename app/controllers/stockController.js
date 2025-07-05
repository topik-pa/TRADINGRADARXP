import { Stock } from '../models/Stock.js'

export async function createStock(data) {
  try {
    const stock = new Stock(data)
    const savedStock = await stock.save()
    return savedStock
  } catch (err) {
    console.error('Error saving stock:', err)
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
    console.error('Error during upsert stock:', err)
    throw err
  }
}
