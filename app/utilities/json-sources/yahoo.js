/* eslint-disable no-console */
import 'dotenv/config'
import fs from 'fs'
import { exit } from 'process'

const OUTPUT_PATH = './app/utilities/json-sources/output.json'
const BASEURL = 'https://finance.yahoo.com/quote/'

const SLEEP_TIME = 2 * 1000 // 5 seconds...
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}


export function getCountryCode(stock) {
  const countryCode = stock.sources[0].slice(-4)
  switch (countryCode) {
  case 'EXGM':
  case 'MTAA':
    return 'MI'
  case 'XAMS':
    return 'AS'
  case 'MERK':
    return 'OL'
  case 'XBRU':
    return 'BR'
  case 'XPAR':
  case 'ALXP':
  case 'XMLI':
    return 'PA'
  case 'XOSL':
    return 'OL'
  case 'BGEM':
    if(stock.code[0] === '1') {
      return 'MI'
    } else {
      return ''
    }
  default:
    return null
  }
}

// export async function getDataAndPopulate(json) {
//   // For each alphabet letter...
//   for (const letter of alphabet) {
//     // Get data from remote
//     console.log('Get remote stocks data')
//     let stocks
//     try {
//       stocks = await getStocksByLetter(letter)
//     } catch (error) {
//       console.error(error)
//     }
//     // For each stock received...
//     for (const rstock of stocks) {
//       console.log('Search for ' + rstock[3] + ' in DB...')
//       const dbstock = await Stock.findOne({ code: rstock[3] })
//       if(dbstock) {
//         console.log('Founded: ' + rstock[3])
//         const source = {}
//         source.url = (BASEURL + new JSDOM(rstock[1]).window.document.querySelector('a')?.getAttribute('href')) || null
//         source.targets = TARGETS
//         const jsonstock = json.find((el) => {return el.code === rstock[3]})
//         // Elimina il vecchio elemento source
//         jsonstock.sources.pop(jsonstock.sources.find((el) => {return el.url === source.url}))
//         jsonstock.sources.push(source)
//         updated++
//       }
//     }
//     console.log('Sleeping...')
//     await sleep(SLEEP_TIME)
//   }
// }



// Leggi il contenuto del file di input
fs.readFile(OUTPUT_PATH, 'utf8', async(err, data) => {
  if (err) {
    console.error('Errore durante la lettura del file: ' + OUTPUT_PATH, err)
    return
  }

  const output = JSON.parse(data)
  // For each alphabet letter...
  //for (const letter of alphabet) {
  // Get data from remote
  //console.log('Get remote stocks data')
  //const stocks = await getStocksFromEuronext(letter)
  // For each stock received...
  //console.log('Saving json source data')
  for (const stock of output) {
    //const s = filterStocksAndBuildData(stock)
    //if(!s) continue
    //console.log('Feeding stock: ', s.name)
    //const jsonStock = output.find((elem) => { return elem.isin === s.isin })
    //if(jsonStock) {
    //jsonStock.sources.pop(jsonStock.sources.find((el) => {return el.url === s.url}))
    const countryCode = getCountryCode(stock)
    const url = countryCode === null ? null : BASEURL + stock.code + '.' + countryCode
    stock.sources.push(url)

    //jsonStock.sources.pop(jsonStock.sources.find((el) => {return el.url2 === s.url2}))
    //jsonStock.sources.push(s.urlPerformance)
    //}
  }
  //}
  //await sleep(SLEEP_TIME)
  // For each alphabet letter

  try {
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')
  } catch (error) {
    console.log(error)
  }

  console.log('File ' + OUTPUT_PATH + ' feeded')
  exit(0)

})
