
import { JSDOM } from 'jsdom'
import { Stock } from '../models/Stock.js'
import { upsertStock, upsertHistory, readHistory } from '../controllers/db.controller.js'
import pLimit from 'p-limit'
import logger from '../config/logger.js'


/*async function getUpdatedData(stock) {
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
    TARGETS[i].forEach(t => {
      key = t.key
      value = new JSDOM(html).window.document.querySelector(t.path)?.firstChild?.nodeValue.trim() || null //!!
      if (key==='relVariation') {
        value = value?.replace(/[()%]/g, '')
      }
      if (key==='price' || key==='volume') {
        value = value?.replace(/[,]/g, '')

        update.history[key] = Array.isArray(stock?.history?.[key]) ? stock?.history?.[key] : []
        if(fod) {
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

      update.history = stock.history ? stock.history : {}
    })
  }
}*/



export async function setDynamicData(fod=false, partial=false) {
  async function getStocks() {
    let cursor
    try {
      cursor = Stock.find().cursor()
    } catch (e) {
      logger.error('Error getting stocks: ', e.message)
    }
    const tasks = []
    for await (const stock of cursor) {
      tasks.push(limit(() => updateDynamicData(stock.isin, stock.sources)))
    }
    await Promise.all(tasks)
    logger.info('All stocks updated!')
  }
  async function updateDynamicData(isin, sources) {
    const updatedData = await getUpdateData(sources)
    updatedData.isin = isin
    // Update History data
    await updateHistory(isin, updatedData.price, updatedData.volume)
    await upsertStock(updatedData)
  }
  async function getUpdateData(sources) {
    let data = {}
    // For every url in sources...
    for (const [i, url] of sources.entries()) {
      if (partial && i===2) continue
      let html
      logger.info('Conneting to: ' + url)
      try {
        html = await (await fetch(url)).text()
      } catch (error) {
        logger.error(new Error(error.message))
      }
      const fragment = getUpdateFragment(i, html)
      data = { ...data, ...fragment }
    }
    return data
  }
  function getUpdateFragment(index, html) {
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
        },
        {
          key: 'status',
          path: '#instrstatusl1'
        }
      ],
      [
        {
          key: 'volume',
          path: 'table > tbody > tr:nth-child(3) > td:nth-child(2)'
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
      ]
    ]
    const fragment = {}
    let key, value
    TARGETS[index].forEach(t => {
      key = t.key
      value = new JSDOM(html).window.document.querySelector(t.path)?.firstChild?.nodeValue.trim() || null //!!

      /*Exceptions*/
      if (key==='relVariation') {
        value = value?.replace(/[()%]/g, '')
      }
      if (key==='volume') {
        const testEl = new JSDOM(html).window.document.querySelector('table > tbody > tr:nth-child(3) td.py-1')
        if(testEl){
          value = new JSDOM(html).window.document.querySelector('table > tbody > tr:nth-child(4) > td:nth-child(2)')?.firstChild?.nodeValue.trim() || null //!!
        }
      }
      if (key==='price' || key==='volume') {
        value = value?.replace(/[,]/g, '')
      }
      /*Exceptions*/

      fragment[key] = value
    })
    return fragment
  }
  async function updateHistory(isin, price, volume) {
    const history = await readHistory(isin) || { isin }
    if(!Array.isArray(history.prices)){
      history.prices = []
    }
    if(!Array.isArray(history.volumes)){
      history.volumes = []
    }
    if(fod) {
      history.prices.push(+price)
      history.volumes.push(+volume)
    } else {
      history.prices[history.prices.length - 1] = +price
      history.volumes[history.volumes.length - 1] = +volume
    }
    await upsertHistory(history)
  }

  const limit = pLimit(5)
  getStocks()
}
