import cron from 'node-cron'
import JSDOM from 'jsdom'
import { upsertStock } from '../controllers/stockController.js'
const alphabet = 'A'//BCDEFGHIJKLMNOPQRSTUVWXYZ#'
//const schedule = '0 21 * * 1,2,3,4,5'
const schedule = '*/5 * * * * *'

const getStocksByLetter = async function(letter) {
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
  headers.append('cookie', 'visid_incap_2790185=tJ0zST2vRpyf+BhOUOoRdSB1wGcAAAAAQUIPAAAAAAApzUo8e5riX9d7mVg5oNPK; OptanonAlertBoxClosed=2025-02-27T14:22:32.981Z; eupubconsent-v2=CQNfCFgQNfCFgAcABBENBeFgAAAAAAAAAChQAAAAAAAA.YAAAAAAAAAAA; visid_incap_2691598=4OiTLlcZQBKDj5fgZHkhjkyWZ2gAAAAAQUIPAAAAAADciS/P1rY4ZtOjjw46INhm; incap_ses_1576_2691598=uJGzED/88x6+HVxD+hPfFQLdZ2gAAAAAhUegshdRztVhprN1SV7c4w==; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Jul+04+2025+18%3A32%3A35+GMT%2B0200+(Ora+legale+dell%E2%80%99Europa+centrale)&version=202310.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=d53f7ba6-af79-44ff-bed8-c2f80a3928e5&interactionCount=1&landingPath=NotLandingPage&groups=C0002%3A0%2CC0003%3A0%2CC0001%3A1%2CC0004%3A0%2CV2STACK42%3A0&genVendors=V4%3A0%2CV19%3A0%2CV24%3A0%2CV10%3A0%2CV21%3A0%2CV3%3A0%2CV20%3A0%2C&geolocation=IT%3B62&AwaitingReconsent=false')
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
    response = await fetch(request)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    json = await response.json()
  } catch (error) {
    console.error(error.message)
  }
  return json['aaData']
}
const collectStockInitData = function(stock) {
  return {
    name: new JSDOM.JSDOM(stock[1]).window.document.querySelector('a').textContent,
    isin: stock[2],
    code: stock[3],
    market: new JSDOM.JSDOM(stock[4]).window.document.querySelector('div').getAttribute('title'),
    currency: new JSDOM.JSDOM(stock[5]).window.document.querySelector('div').firstChild.nodeValue.trim()
  }
}
export async function dailyUpdateDB() {
  cron.schedule(schedule, async() => {
    // For each alphabet letter...
    for (const letter of alphabet) {
      // Get data from remote
      const stocks = await getStocksByLetter(letter)
      // For each stock received...
      stocks.forEach(async stock => {
        // Some entries must not be included: other market or no price/currency data
        const marketCode = new JSDOM.JSDOM(stock[4]).window.document.querySelector('div').textContent
        if (['MTAH', 'ETLX'].includes(marketCode) || !new JSDOM.JSDOM(stock[5]).window.document.querySelector('span') ) return
        // Upsert stock on DB
        try {
          await upsertStock(collectStockInitData(stock))
        } catch (error) {
          console.error(error.message)
        }
      })
    }

  })
}
