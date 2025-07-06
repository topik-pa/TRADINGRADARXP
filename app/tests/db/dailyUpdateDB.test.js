/* eslint-disable no-useless-escape */
/* eslint-disable quotes */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { collectStockInitData } from '../../db/dailyUpdateDB.js'
// import { getStocksByLetter } from '../../db/dailyUpdateDB.js'
import { reportGenerator } from '../../db/dailyUpdateDB.js'
// import { sendMessage } from '../../db/dailyUpdateDB.js'
// import Mailgun from 'mailgun.js'
// import FormData from 'form-data'

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

/*describe('getStocksByLetter (real fetch)', () => {
  it('should fetch real data and call fetch once', async() => {
    // Spy sulla fetch globale, ma senza mockarla
    const fetchSpy = vi.spyOn(global, 'fetch')

    const result = await getStocksByLetter('A')

    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(Array.isArray(result[0])).toBe(true)
    expect(result[0].length).toBe(10)

    fetchSpy.mockRestore() // pulizia
  })
})*/

describe('reportGenerator', () => {
  it('should return an object with add and get methods', () => {
    const report = reportGenerator()
    expect(typeof report.add).toBe('function')
    expect(typeof report.get).toBe('function')
  })

  it('should initialize with an empty string if no subreport is passed', () => {
    const report = reportGenerator()
    expect(report.get()).toBe('')
  })

  it('should initialize with the given subreport', () => {
    const report = reportGenerator('Init: ')
    expect(report.get()).toBe('Init: ')
  })

  it('should concatenate added strings', () => {
    const report = reportGenerator('Start: ')
    report.add('Line1. ')
    report.add('Line2.')
    expect(report.get()).toBe('Start: Line1. Line2.')
  })

  it('should work with empty strings and spaces', () => {
    const report = reportGenerator('Report:')
    report.add(' ')
    report.add('')
    report.add('Done')
    expect(report.get()).toBe('Report: Done')
  })

  it('should not affect other instances', () => {
    const r1 = reportGenerator('First')
    const r2 = reportGenerator('Second')

    r1.add(' One')
    r2.add(' Two')

    expect(r1.get()).toBe('First One')
    expect(r2.get()).toBe('Second Two')
  })

  it('should allow chained additions (manually)', () => {
    const report = reportGenerator()
    report.add('A')
    report.add('B')
    report.add('C')
    expect(report.get()).toBe('ABC')
  })

  it('should support Unicode and special characters', () => {
    const report = reportGenerator('🚀')
    report.add('✓ ')
    report.add('Δεδομένα')
    expect(report.get()).toBe('🚀✓ Δεδομένα')
  })
})

vi.mock('mailgun.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      client: vi.fn().mockReturnValue({
        messages: {
          create: vi.fn().mockResolvedValue({ id: '123' })
        }
      })
    }))
  }
})

// describe('sendMessage', () => {
//   beforeEach(() => {
//     process.env.MAILGUN_SECRET_KEY = 'testkey'
//   })

//   it('should call mailgun.messages.create with correct parameters', async() => {
    
//     const mailgun = new Mailgun(FormData)
//     const mockCreate = mailgun.client().messages.create

//     const report = 'This is a test report'
//     await sendMessage(report)

//     expect(mockCreate).toHaveBeenCalledWith('ftt.tradingradar.net', {
//       from: 'tradingradar.net <followthetitle@ftt.tradingradar.net>',
//       to: 'Marco Pavan <marcopavan.mp@gmail.com>',
//       subject: 'Rapporto update DB tradingradar',
//       text: report
//     })
//   })
// })