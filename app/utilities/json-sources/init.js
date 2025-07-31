/* eslint-disable no-console */
import 'dotenv/config'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import { exit } from 'process'

const OUTPUT_PATH = './app/utilities/json-sources/output.json'

let alphabet
if(process.env.NODE_ENV !== 'production') {
  alphabet = 'A'
} else {
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
}

const SLEEP_TIME = 2 * 1000 // 5 seconds...
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const getStocksFromEuronext = async function(letter) {
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
  const body = `draw=4&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=6&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=7&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=false&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=8&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=false&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=9&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=false&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=100&search%5Bvalue%5D=&search%5Bregex%5D=false&args%5BinitialLetter%5D=${letter}&iDisplayLength=100&iDisplayStart=0&sSortDir_0=asc&sSortField=name`
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
export function filterStocksAndBuildData(stock) {
  if (
    !stock ||
    !Array.isArray(stock) ||
    stock.length < 6 ||
    ['MTAH', 'ETLX'].includes(new JSDOM(stock[4]).window.document.querySelector('div').textContent) ||
    !new JSDOM(stock[5]).window.document.querySelector('span')
    // Some entries must not be included: other market or no price/currency data
  ) return null
  const name = new JSDOM(stock[1]).window.document.querySelector('a').textContent
  const isin = stock[2]
  const code = stock[3] || null
  if (!name || !isin || !code) return null
  return { name, isin, code }
}


// Leggi il contenuto del file di input
// eslint-disable-next-line no-unused-vars
fs.readFile(OUTPUT_PATH, 'utf8', async(err, data) => {
  if (err) {
    console.error('Errore durante la lettura del file: ' + OUTPUT_PATH, err)
    return
  }

  const output = []
  // For each alphabet letter...
  for (const letter of alphabet) {
    // Get data from remote
    console.log('Get remote stocks data')
    const stocks = await getStocksFromEuronext(letter)
    // For each stock received...
    console.log('Saving json init data')
    for (const stock of stocks) {
      const s = filterStocksAndBuildData(stock)
      if(!s) continue
      console.log('Adding stock: ', s.name)
      s.sources = []
      output.push(s)
    }
  }
  await sleep(SLEEP_TIME)
  // For each alphabet letter

  try {
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')
  } catch (error) {
    console.log(error)
  }

  console.log('File ' + OUTPUT_PATH + ' written')
  exit(0)
})
