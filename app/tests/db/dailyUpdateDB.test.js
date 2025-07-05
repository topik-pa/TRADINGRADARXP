/* eslint-disable no-useless-escape */
/* eslint-disable quotes */
import { describe, it, expect } from 'vitest'
import { collectStockInitData } from '../../db/dailyUpdateDB.js'

describe('collectStockInitData', () => {
  it('return "null" if null is received', () => {
    const stock = null
    const result = collectStockInitData(stock)

    expect(result).toEqual(null)
  })
  it('return "null" if param is not an array', () => {
    let stock = ''
    let result = collectStockInitData(stock)

    expect(result).toEqual(null)

    stock = 123
    result = collectStockInitData(stock)

    expect(result).toEqual(null)

    stock = {}
    result = collectStockInitData(stock)

    expect(result).toEqual(null)
  })

  it('return correct data if expected param is passed', () => {
    const stock = [
      "",
      "\u003Ca href=\u0027\/en\/product\/equities\/FR0013185857-XPAR\u0027 data-order=\u0027ABEO\u0027 data-title-hover=\u0027ABEO\u0027\u003EABEO\u003C\/a\u003E",
      "FR0013185857",
      "ABEO",
      "\u003Cdiv class=\u0027nowrap pointer\u0027 title=\u0027Euronext Paris\u0027 \u003EXPAR\u003C\/div\u003E",
      "\u003Cdiv class=\u0027text-right pd_currency_es\u0027\u003EEUR \u003Cspan class=\u0027pd_last_price_es\u0027\u003E9.36\u003C\/span\u003E\u003C\/div\u003E",
      "\u003Cdiv class=\u0027text-right pd_percent\u0027\u003E\u003Cspan class=red\u003E-1.47%\u003C\/span\u003E\u003C\/div\u003E",
      "\u003Cdiv class=\u0027text-right pointer tooltipDesign\u0027 \u003E04 Jul 2025\u003Cspan class=\u0022tooltiptext\u0022\u003E17:35 CEST\u003C\/span\u003E\u003C\/div\u003E",
      "\u003Cdiv class=\u0022text-right\u0022\u003E9.36\u003C\/div\u003E",
      "\u003Cdiv class=\u0022text-right\u0022\u003E04 Jul 2025\u003C\/div\u003E"
    ]

    const result = collectStockInitData(stock)

    expect(result).toEqual({
      name: 'ABEO',
      isin: 'FR0013185857',
      code: 'ABEO',
      market: 'Euronext Paris',
      currency: 'EUR'
    })
  })

  it('returns "null" if param is malformed', () => {
    let stock = [
      '',
      '<a></a>',
      '',
      '',
      '<div></div>',
      '<div>  </div>'
    ]
    let result = collectStockInitData(stock)
    expect(result).toEqual(null)

    stock = [
      ''
    ]
    result = collectStockInitData(stock)
    expect(result).toEqual(null)

    stock = [
      '',
      '',
      '',
      ''
    ]
    result = collectStockInitData(stock)
    expect(result).toEqual(null)

    stock = [
      "",
      "\u003Ca href=\u0027\/en\/product\/equities\/IT0001233417-MTAA\u0027 data-order=\u0027A2A\u0027 data-title-hover=\u0027A2A\u0027\u003EA2A\u003C\/a\u003E",
      "IT0001233417",
      null,
      "\u003Cdiv class=\u0027nowrap pointer\u0027 title=\u0027Euronext Milan\u0027 \u003EMTAA\u003C\/div\u003E",
      "\u003Cdiv class=\u0027text-right pd_currency_es\u0027\u003EEUR \u003Cspan class=\u0027pd_last_price_es\u0027\u003E2.238\u003C\/span\u003E\u003C\/div\u003E",
      "\u003Cdiv class=\u0027text-right pd_percent\u0027\u003E\u003Cspan class=red\u003E-1.19%\u003C\/span\u003E\u003C\/div\u003E",
      "\u003Cdiv class=\u0027text-right pointer tooltipDesign\u0027 \u003E04 Jul 2025\u003Cspan class=\u0022tooltiptext\u0022\u003E17:35 CEST\u003C\/span\u003E\u003C\/div\u003E",
      "\u003Cdiv class=\u0022text-right\u0022\u003E2.238\u003C\/div\u003E",
      "\u003Cdiv class=\u0022text-right\u0022\u003E04 Jul 2025\u003C\/div\u003E"
    ]
    result = collectStockInitData(stock)
    expect(result).toEqual(null)

    stock = [
      "",
      "\u003Ca href=\u0027\/en\/product\/equities\/IT0001233417-MTAA\u0027 data-order=\u0027A2A\u0027 data-title-hover=\u0027A2A\u0027\u003EA2A\u003C\/a\u003E",
      "IT0001233417",
      "A2A",
      "\u003Cdiv class=\u0027nowrap pointer\u0027 title=\u0027Euronext Milan\u0027 \u003EMTAA\u003C\/div\u003E",
      "\u003Cdiv class=\u0027text-right pd_currency_es\u0027\u003E \u003Cspan class=\u0027pd_last_price_es\u0027\u003E2.238\u003C\/span\u003E\u003C\/div\u003E",
      "\u003Cdiv class=\u0027text-right pd_percent\u0027\u003E\u003Cspan class=red\u003E-1.19%\u003C\/span\u003E\u003C\/div\u003E",
      "\u003Cdiv class=\u0027text-right pointer tooltipDesign\u0027 \u003E04 Jul 2025\u003Cspan class=\u0022tooltiptext\u0022\u003E17:35 CEST\u003C\/span\u003E\u003C\/div\u003E",
      "\u003Cdiv class=\u0022text-right\u0022\u003E2.238\u003C\/div\u003E",
      "\u003Cdiv class=\u0022text-right\u0022\u003E04 Jul 2025\u003C\/div\u003E"
    ]
    result = collectStockInitData(stock)
    expect(result).toEqual({
      "code": "A2A",
      "currency": null,
      "isin": "IT0001233417",
      "market": "Euronext Milan",
      "name": "A2A"
    })
  })
})
