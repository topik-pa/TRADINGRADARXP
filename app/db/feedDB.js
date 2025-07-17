 
import { JSDOM } from 'jsdom'
import { readFile } from 'fs/promises'
import { upsertStock } from '../controllers/stockController.js'
import { cleanDB } from '../utilities/cleanDB.js'
import logger from '../config/logger.js'

const OUTPUT_PATH = '../utilities/json-sources/output.json'

const SLEEP_TIME = 3 * 1000 // 3 seconds...
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const TARGETS = [
  [
    {
      key: 'price',
      path: '#header-instrument-price'
    },
    {
      key: 'absVariation',
      path: '.mt-auto span:nth-child(2)'
    },
    {
      key: 'relVariation',
      path: '.mt-auto span:nth-child(3)'
    }
  ]
]

export async function feedDB() {
  const json = JSON.parse(
    await readFile(
      new URL(OUTPUT_PATH, import.meta.url)
    )
  )
  // For every stock in JSON...
  for (const stock of json) {
    // For every url in source...
    for (const [i, url] of stock.sources.entries()) {
      let html, key, value 
      const update = {}
      logger.info('Conneting to: ' + url)
      try {
        html = await (await fetch(url)).text()
      } catch (error) {
        logger.error(new Error(error.message))
      }
      update.isin = stock.isin
      TARGETS[i].forEach(t => {
        key = t.key
        value = new JSDOM(html).window.document.querySelector(t.path)?.firstChild?.nodeValue.trim() || null //!!
        update[key] = value
      })
      try {
        logger.info('Updating stock: ' + stock.name)
        await upsertStock(update)
      } catch (error) {
        logger.error(new Error(error.message))
      }
    } // For every url in source
    await sleep(SLEEP_TIME)
  } // For every stock in JSON
  // Clean DB data
  logger.info('Start DB clean...')
  await cleanDB()
  logger.info('DB clean done')
}
