
import { JSDOM } from 'jsdom'
import { readFile } from 'fs/promises'
import { upsertStock, readStock } from '../controllers/db.controller.js'
// import { cleanDB } from '../utilities/cleanDB.js'
import logger from '../config/logger.js'

const OUTPUT_PATH = '../utilities/json-sources/output.json'

const SLEEP_TIME = 0.2 * 1000 // 3 seconds...
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
  ],
  [
    {
      key: 'perf1M',
      path: 'table > tbody > tr:nth-child(3) > td:nth-child(3)'
    },
    {
      key: 'perf52W',
      path: 'table > tbody > tr:nth-child(3) > td:nth-child(4)'
    }
  ],
  [
    {
      key: 'volume',
      path: 'table > tbody > tr:nth-child(4) > td:nth-child(2)'
    },
    {
      key: 'cap',
      path: 'table > tbody > tr:nth-child(14) > td:nth-child(2)'
    }
  ]
]


export async function feedDB(mode) {
  const json = JSON.parse(
    await readFile(
      new URL(OUTPUT_PATH, import.meta.url)
    )
  )
  // For every stock in JSON...
  for (const stock of json) {
    // For every url in sources...
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

      let savedStock = null
      // if(mode === 'fod') {
      savedStock = await readStock(stock.isin)
      update.history = savedStock?.history ? savedStock.history : {}
      // }

      TARGETS[i].forEach(t => {
        key = t.key
        value = new JSDOM(html).window.document.querySelector(t.path)?.firstChild?.nodeValue.trim() || null //!!
        if (key==='relVariation') {
          value = value?.replace(/[()%]/g, '')
        }
        if (key==='price' || key==='volume') {
          value = value?.replace(/[,]/g, '')

          update.history[key] = Array.isArray(savedStock?.history?.[key]) ? savedStock?.history?.[key] : []
          if(mode === 'fod') {
            update.history[key].push(+value)
            if (update.history[key].length > 23) update.history[key].shift()
          } else {
            update.history[key][update.history[key].length - 1] = +value
          }
        }
        if (key==='cap' && value) {
          const order = value.slice(-1)
          const digits = value.slice(0, -1)
          value = order === 'B' ? digits * 1_000 : digits
        }
        update[key] = value


      })
      try {
        logger.info('Updating stock: ' + stock.name)
        await upsertStock(update)
      } catch (error) {
        logger.error(new Error(error.message))
      }
    } // For every url in sources
    await sleep(SLEEP_TIME)
  } // For every stock in JSON
  // Clean DB data
  //logger.info('Start DB clean...')
  // await cleanDB()
  //logger.info('DB clean done')
}
