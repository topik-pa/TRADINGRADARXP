
import { JSDOM } from 'jsdom'
import { Stock } from '../models/Stock.js'
import { upsertStock, upsertHistory, readHistory } from '../controllers/db.controller.js'
import pLimit from 'p-limit'
import logger from '../config/logger.js'




export async function setDynamicData(fod=false, partial=[]) {
  const limit = pLimit(3)
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  async function getStocks() {
    let cursor
    try {
      cursor = Stock.find().cursor()
    } catch (e) {
      logger.error('Error getting stocks: ', e.message)
    }
    const tasks = []
    for await (const stock of cursor) {
      tasks.push(limit(async() => {
        await updateDynamicData(stock.isin, stock.sources)
        await sleep(500) //to avoid rate limiting
      }))
    }
    await Promise.all(tasks)
    logger.info('All stocks updated!')
  }
  async function updateDynamicData(isin, sources) {
    const updatedData = await getUpdateData(sources)
    updatedData.isin = isin
    try {
      // Update History data
      if (updatedData.price && updatedData.volume) {
        await updateHistory(isin, updatedData.price, updatedData.volume)
      }
      // Update Stock data
      await upsertStock(updatedData)
    } catch (error) {
      logger.error(new Error(error.message))
    }
  }
  async function getUpdateData(sources) {
    let data = {}
    // For every url in sources...
    for (const [i, url] of sources.entries()) {
      if (!partial.includes(i)) continue
      let html
      logger.info('Conneting to: ' + url)
      try {
        const response = await fetch(url)
        if (response.status === 429) {
          logger.warn('!Status 429!')
        }
        html = await response.text()
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
        },
        {
          key: 'lastTrade',
          path: '.last-price-date-time'
        }
      ],
      [
        {
          key: 'volume',
          path: 'table > tbody > tr:nth-child(3) > td:nth-child(2)'
        },
        {
          key: 'cap',
          path: 'table > tbody > tr:nth-child(13) > td:nth-child(2)'
        },
        {
          key: 'resistance',
          path: 'table > tbody > tr:nth-child(10) > td:nth-child(2) > span:nth-child(1)'
        },
        {
          key: 'support',
          path: 'table > tbody > tr:nth-child(10) > td:nth-child(2) > span:nth-child(2)'
        }
      ],
      [
        {
          key: 'perf1M',
          path: 'table > tbody > tr:nth-child(3) > td:nth-child(3)'
        },
        {
          key: 'perf52W',
          path: 'table > tbody > tr:nth-child(3) > td:nth-child(5)'
        }
      ]
    ]
    const fragment = {}
    let key, value
    TARGETS[index].forEach(t => {
      key = t.key
      value = new JSDOM(html).window.document.querySelector(t.path)?.firstChild?.nodeValue.trim() || null //!!

      const valuationClose = new JSDOM(html).window.document.querySelector('table > tbody > tr:nth-child(3) td.py-1')

      /*Exceptions*/
      if (key==='cap') {
        if(valuationClose){
          value = new JSDOM(html).window.document.querySelector('table > tbody > tr:nth-child(14) > td:nth-child(2)')?.firstChild?.nodeValue.trim() || null //!!
        }
        if(value) {
          value = value.replace(/[,]/g, '')
          if(value.indexOf('B') !== -1) {
            value = +value.replace('B', '') * 1e3
          } else if(value.indexOf('M') !== -1) {
            value = +value.replace('M', '') * 1
          } else if(value.indexOf('K') !== -1) {
            value = +value.replace('K', '') / 1000
          }
        }
      }
      if (key==='relVariation') {
        value = value?.replace(/[()%]/g, '')
      }
      if (key==='volume') {

        if(valuationClose){
          value = new JSDOM(html).window.document.querySelector('table > tbody > tr:nth-child(4) > td:nth-child(2)')?.firstChild?.nodeValue.trim() || null //!!
        }
        if(value !== null) {
          value = value?.replace(/[,]/g, '')
          value = isNaN(+value) ? null : +value
        }
      }
      if (key==='price' || key==='perf1M' || key==='perf52W' || key==='absVariation') {
        value = value?.replace(/[,]/g, '')
      }
      if (key==='lastTrade' && value) {
        value = value.replaceAll('\t', '').replace('\n', '')
      }

      if (key==='resistance' && valuationClose) {
        value = new JSDOM(html).window.document.querySelector('table > tbody > tr:nth-child(11) > td:nth-child(2) > span:nth-child(1)')?.firstChild?.nodeValue.trim() || null //!!
      }
      if (key==='support' && valuationClose) {
        value = new JSDOM(html).window.document.querySelector('table > tbody > tr:nth-child(11) > td:nth-child(2) > span:nth-child(2)')?.firstChild?.nodeValue.trim() || null //!!
      }
      /*Exceptions*/

      fragment[key] = value
    })
    return fragment
  }
  async function updateHistory(isin, price, volume) {
    let history
    try {
      history = await readHistory(isin) || { isin }
    } catch (error) {
      logger.error(new Error(error.message))
    }
    if(!Array.isArray(history.prices)){
      history.prices = []
    }
    if(!Array.isArray(history.volumes)){
      history.volumes = []
    }
    if(fod) {
      history.prices.push(+price)
      history.volumes.push(+volume)
      history.prices = history.prices.slice(-22)
      history.volumes = history.volumes.slice(-22)
    } else {
      history.prices[history.prices.length - 1] = +price
      history.volumes[history.volumes.length - 1] = +volume
    }
    try {
      await upsertHistory(history)
    } catch (error) {
      logger.error(new Error(error.message))
    }
  }

  getStocks()
}
