/* eslint-disable no-console */
import 'dotenv/config'
import fs from 'fs'
import { Stock } from '../../models/Stock.js'
import { connectToDB } from '../../db/mongoose.js'
import { exit } from 'process'

const OUTPUT_PATH = './app/utilities/json-sources/output.json'


// Leggi il contenuto del file di input
fs.readFile(OUTPUT_PATH, 'utf8', async(err, data) => {
  if (err) {
    console.error('Errore durante la lettura del file: ' + OUTPUT_PATH, err)
    return
  }

  await connectToDB() 
  const output = []
  const stocks = await Stock.find()

  if(!stocks.length) {
    console.log('Il database non contiene stock')
  } else {
    for (const stock of stocks) {
      console.log('Inserimento dati stock: ', stock.name)
      const out = {}
      out.isin = stock.isin
      out.code = stock.code
      out.sources = []
      output.push(out)
    }
  }

  await fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')
  console.log('File ' + OUTPUT_PATH + ' written')

  exit(0)
})