/* eslint-disable no-console */
import 'dotenv/config'
import pLimit from 'p-limit'
import Mailgun from 'mailgun.js'
import { upsertStock } from '../controllers/db.controller.js'
import { connectToDB } from '../db/mongoose.js'
import { JSDOM } from 'jsdom'
const BASEURL = 'https://live.euronext.com'


const getStocksFromEuronext = async function(letter) {
  const maxLength = 500
  const url = 'https://live.euronext.com/en/pd_es/data/stocks?mics=dm_all_stock'
  const headers = new Headers()
  headers.append('accept', 'application/json, text/javascript, */*; q=0.01')
  headers.append('accept-language', 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7,fr;q=0.6')
  headers.append('cache-control', 'no-cache')
  headers.append('content-type', 'application/x-www-form-urlencoded; charset=UTF-8')
  headers.append('pragma', 'no-cache')
  headers.append('priority', 'u=1, i')
  headers.append('sec-ch-ua', '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"')
  headers.append('sec-ch-ua-mobile', '?0')
  headers.append('sec-ch-ua-platform', 'Linux')
  headers.append('sec-fetch-dest', 'empty')
  headers.append('sec-fetch-mode', 'cors')
  headers.append('sec-fetch-site', 'same-origin')
  headers.append('x-requested-with', 'XMLHttpRequest')
  headers.append('Referer', 'https://live.euronext.com/en/products/equities/list')
  headers.append('Referrer-Policy', 'strict-origin-when-cross-origin')
  const body = `draw=4&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=6&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=7&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=false&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=${maxLength}&search%5Bvalue%5D=&search%5Bregex%5D=false&args%5BinitialLetter%5D=${letter}&args%5Bdisplay_datapoints%5D=logo%2Cname%2Cisin%2Csymbol%2Cmarket%2ClastPrice%2CprecentDayChange%2ClastTradeTime&iDisplayLength=${maxLength}&iDisplayStart=0&sSortDir_0=asc&sSortField=name`
  const request = new Request(url, {
    method: 'POST',
    body,
    headers
  })
  let response, json = null
  try {
    console.log(`Conneting to: ${request.url} with param ${letter}`)
    response = await fetch(request)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    json = await response.json()
  } catch (error) {
    console.error(new Error(error.message))
  }
  return json['aaData']
}

export function isStockValid(stock) {
  // Some entries must not be included: other market or no price/currency data
  if (
    !stock ||
    !Array.isArray(stock) ||
    stock.length < 6 ||
    ['MTAH', 'ETLX'].includes(new JSDOM(stock[4]).window.document.querySelector('div').textContent) ||
    !new JSDOM(stock[5]).window.document.querySelector('span')
  ) return false
  return true
}

export function getStaticData(stock) {
  const name = new JSDOM(stock[1]).window.document.querySelector('a').textContent
  const isin = stock[2]
  const code = stock[3]
  const slug = encodeURI(name.toLowerCase().replaceAll(/[\s.]/g, '-'))
  // Some fields are required
  if (!name || !isin || !code || !slug) return null

  const market = new JSDOM(stock[4]).window.document.querySelector('div').getAttribute('title') || null

  const currency = new JSDOM(stock[5]).window.document.querySelector('div').firstChild.nodeValue?.trim() || null

  let url1 = (BASEURL + new JSDOM(stock[1]).window.document.querySelector('a')?.getAttribute('href')) || ''
  if (url1) {
    url1 = url1.replace('product', 'ajax').replace('equities', 'getDetailedQuote')
  }
  const url2 = `https://live.euronext.com/en/intraday_chart/getDetailedQuoteAjax/${url1.split('/').pop()}/full`
  const url3 = url1.replace('getDetailedQuote', 'getPerformances')

  return {
    name,
    isin,
    code,
    slug,
    market,
    currency,
    sources: [
      url1, url2, url3
    ]
  }
}

export function reportGenerator(subreport = '') {
  let result = subreport
  return {
    add(str) {
      result += str
    },
    get() {
      return result
    }
  }
}

export async function sendMessage(report) {
  if(process.env.NODE_ENV !== 'production') {
    console.info(report)
    return
  }
  const mailgun = new Mailgun(FormData)
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_SECRET_KEY,
    url: 'https://api.eu.mailgun.net'
  })
  try {
    await mg.messages.create('ftt.tradingradar.net', {
      from: 'tradingradar.net <followthetitle@ftt.tradingradar.net>',
      to: 'Marco Pavan <marcopavan.mp@gmail.com>',
      subject: 'Rapporto update DB tradingradar',
      text: report
    })
  } catch (error) {
    console.error(new Error(error.message))
  }
}


await connectToDB()

// Init report
const report = reportGenerator('tradingradar.net report del ' + new Date(Date.now()).toLocaleString() + '\n\n')

// For each alphabet letter...
for(const letter of process.env.ALPHABET) {
  let addedStocks = 0
  // Get data from remote
  const stocks = await getStocksFromEuronext(letter)
  // For each stock received...
  console.info('Saving stocks static data')
  report.add('Added stocks for letter: ' + letter + '\n')
  // ALERT: for mongoDB service limitation limit must be low
  const limit = pLimit(5)
  // let test = [stocks[0], stocks[1], stocks[2], stocks[3], stocks[4]]
  const results = await Promise.allSettled(
    stocks.map(stock => {
      if(isStockValid(stock)) {
        const storing = getStaticData(stock)
        if(storing) {
          return limit(async() => {
            try {
              await upsertStock(storing)
              report.add(storing.code+'*')
              console.info(storing.name + ' saved in DB')
              addedStocks++
            } catch (e) {
              console.error('Error saving stock: ', storing.name, e.message)
              throw e // rilancia per far fallire la promessa, e farla risultare "rejected"
            }
          })
        }
      }
    })
  )
  const errors = results.filter(r => r.status === 'rejected')
  report.add(`\n\nTotal processed: ${results.length}\nStocks added: ${addedStocks}\nErrors: ${errors.length}\n\n\n`)
}

await sendMessage(report.get())

console.info('DB static data inserted')

process.exit(0)
