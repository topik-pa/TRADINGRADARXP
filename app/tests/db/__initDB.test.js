/* eslint-disable no-useless-escape */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Mailgun from 'mailgun.js'
import logger from '../../config/logger.js'
// import { upsertStock } from '../../controllers/stockController.js'
import { sendMessage, reportGenerator, filterStocksAndBuildData, getStocksFromEuronext/*, initDB, sleep*/ } from '../../db/initDB.js'




// describe('initDB', () => {
//   vi.mock('../../config/logger.js', () => ({
//     default: {
//       info: vi.fn(),
//       error: vi.fn()
//     }
//   }))
//   // vi.mock('../../db/initDB.js', () => ({
//   //   reportGenerator: vi.fn(),
//   //   getStocksFromEuronext: vi.fn(),
//   //   filterStocksAndBuildData: vi.fn(),
//   //   sendMessage: vi.fn(),
//   //   sleep: vi.fn()
//   // }))

//   const mockReport = {
//     add: vi.fn(),
//     get: vi.fn().mockReturnValue('Final report')
//   }

//   beforeEach(() => {
//     vi.clearAllMocks()
//     //reportGenerator.mockReturnValue(mockReport)
//   })

//   it('chiama getStocksFromEuronext e salva i dati per ogni lettera', async() => {
//     // Imposta un alfabeto più breve per velocizzare il test
//     let alphabet = ['A', 'B']

//     // getStocksFromEuronext.mockResolvedValue([
//     //   ['<a>Stock 1</a>', 'ISIN1', 'CODE1', '<div title="MTA">MTA</div>', '<div><span>EUR</span>EUR</div>']
//     // ])
//     //filterStocksAndBuildData.mockReturnValue({ name: 'Stock 1', isin: 'ISIN1', code: 'CODE1', market: 'MTA', currency: 'EUR' })
//     //upsertStock.mockResolvedValue()

//     await initDB()

//     expect(reportGenerator).toHaveBeenCalledOnce()
//     expect(getStocksFromEuronext).toHaveBeenCalledTimes(2)
//     expect(filterStocksAndBuildData).toHaveBeenCalledTimes(2)
//     expect(upsertStock).toHaveBeenCalledTimes(2)
//     expect(mockReport.add).toHaveBeenCalled()
//     expect(sendMessage).toHaveBeenCalledWith('Final report')
//     expect(logger.info).toHaveBeenCalledWith('DB init done')
//   })

//   // it('logga errore se upsertStock fallisce ma continua', async () => {
//   //   dbUtils.alphabet = ['X']

//   //   getStocksFromEuronext.mockResolvedValue([
//   //     ['<a>Bad stock</a>', 'ISIN_ERR', 'CODE_ERR', '<div title="MTA">MTA</div>', '<div><span>EUR</span>EUR</div>']
//   //   ])
//   //   filterStocksAndBuildData.mockReturnValue({ name: 'Bad stock', isin: 'ISIN_ERR', code: 'CODE_ERR', market: 'MTA', currency: 'EUR' })
//   //   upsertStock.mockRejectedValue(new Error('DB error'))

//   //   await initDB()

//   //   expect(logger.error).toHaveBeenCalledWith('Error saving stock: ', expect.any(Object), 'DB error')
//   //   expect(sendMessage).toHaveBeenCalled()
//   // })

//   // it('non chiama upsertStock se filterStocksAndBuildData ritorna null', async () => {
//   //   dbUtils.alphabet = ['Z']
//   //   getStocksFromEuronext.mockResolvedValue([['invalid data']])
//   //   filterStocksAndBuildData.mockReturnValue(null)

//   //   await initDB()

//   //   expect(upsertStock).not.toHaveBeenCalled()
//   //   expect(sendMessage).toHaveBeenCalled()
//   // })
// })



describe('getStocksFromEuronext', () => {
  // Mock globale per fetch
  global.fetch = vi.fn()

  // Mock logger
  vi.mock('../../config/logger.js', () => ({
    default: {
      info: vi.fn(),
      error: vi.fn()
    }
  }))

  const mockAaData = [
    ['stock1', 'data1'],
    ['stock2', 'data2']
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('effettua una richiesta POST e restituisce aaData correttamente', async() => {
    const mockJson = vi.fn().mockResolvedValue({ aaData: mockAaData })
    fetch.mockResolvedValue({
      ok: true,
      json: mockJson
    })

    const result = await getStocksFromEuronext('A')

    expect(fetch).toHaveBeenCalledOnce()
    const requestPassed = fetch.mock.calls[0][0]
    expect(requestPassed.method).toBe('POST')
    expect(requestPassed.url).toContain('https://live.euronext.com/en/pd_es/data/stocks')
    //expect(requestPassed.body).toContain('args%5BinitialLetter%5D=A')

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Conneting to'))
    expect(result).toEqual(mockAaData)
  })

  it('logga errore se fetch restituisce stato non ok', async() => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500
    })

    const result = await getStocksFromEuronext('B')
    expect(logger.error).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('logga errore se fetch lancia un errore', async() => {
    fetch.mockRejectedValue(new Error('Network error'))

    const result = await getStocksFromEuronext('C')
    expect(logger.error).toHaveBeenCalledWith(expect.any(Error))
    expect(result).toBeUndefined()
  })
})


describe('filterStocksAndBuildData', () => {

  it('ritorna null se stock è undefined o null', () => {
    expect(filterStocksAndBuildData(undefined)).toBeNull()
    expect(filterStocksAndBuildData(null)).toBeNull()
  })

  it('ritorna null se stock non è un array', () => {
    expect(filterStocksAndBuildData({})).toBeNull()
    expect(filterStocksAndBuildData('test')).toBeNull()
  })

  it('ritorna null se stock ha meno di 6 elementi', () => {
    expect(filterStocksAndBuildData([1, 2, 3, 4, 5])).toBeNull()
  })

  it('ritorna null se il mercato è MTAH o ETLX', () => {
    const stock = [
      '', // [0]
      '<a>Test Company</a>', // [1] nome
      'IT0001234567',         // [2] isin
      'ABC',                  // [3] codice
      '<div>MTAH</div>',      // [4] mercato testuale
      '<div><span>EUR</span></div>' // [5] divisa
    ]
    expect(filterStocksAndBuildData(stock)).toBeNull()

    stock[4] = '<div>ETLX</div>'
    expect(filterStocksAndBuildData(stock)).toBeNull()
  })

  it('ritorna null se manca il tag <span> nella valuta', () => {
    const stock = [
      '', // [0]
      '<a>Test Company</a>', // [1]
      'IT0001234567',         // [2]
      'ABC',                  // [3]
      '<div>MTA</div>',       // [4]
      '<div>EUR</div>'        // [5] manca <span>
    ]
    expect(filterStocksAndBuildData(stock)).toBeNull()
  })

  it('ritorna null se mancano name o isin o code', () => {
    const stockNoName = [
      '',
      '<a></a>',
      'IT0001234567',
      'ABC',
      '<div title="MTA">MTA</div>',
      '<div><span></span>EUR</div>'
    ]
    expect(filterStocksAndBuildData(stockNoName)).toBeNull()

    const stockNoIsin = [
      '',
      '<a>Company</a>',
      '',
      'ABC',
      '<div title="MTA">MTA</div>',
      '<div><span></span>EUR</div>'
    ]
    expect(filterStocksAndBuildData(stockNoIsin)).toBeNull()

    const stockNoCode = [
      '',
      '<a>Company</a>',
      'IT0001234567',
      '',
      '<div title="MTA">MTA</div>',
      '<div><span></span>EUR</div>'
    ]
    expect(filterStocksAndBuildData(stockNoCode)).toBeNull()
  })

  it('ritorna null se manca un campo obbligatorio (name)', () => {
    const stock = [
      '',
      '\u003Ca href=\u0027\/en\/product\/equities\/IT0001233417-MTAA\u0027 data-order=\u0027A2A\u0027 data-title-hover=\u0027A2A\u0027\u003EA2A\u003C\/a\u003E',
      'IT0001233417',
      null,
      '\u003Cdiv class=\u0027nowrap pointer\u0027 title=\u0027Euronext Milan\u0027 \u003EMTAA\u003C\/div\u003E',
      '\u003Cdiv class=\u0027text-right pd_currency_es\u0027\u003EEUR \u003Cspan class=\u0027pd_last_price_es\u0027\u003E2.238\u003C\/span\u003E\u003C\/div\u003E',
      '\u003Cdiv class=\u0027text-right pd_percent\u0027\u003E\u003Cspan class=red\u003E-1.19%\u003C\/span\u003E\u003C\/div\u003E',
      '\u003Cdiv class=\u0027text-right pointer tooltipDesign\u0027 \u003E04 Jul 2025\u003Cspan class=\u0022tooltiptext\u0022\u003E17:35 CEST\u003C\/span\u003E\u003C\/div\u003E',
      '\u003Cdiv class=\u0022text-right\u0022\u003E2.238\u003C\/div\u003E',
      '\u003Cdiv class=\u0022text-right\u0022\u003E04 Jul 2025\u003C\/div\u003E'
    ]
    expect(filterStocksAndBuildData(stock)).toBeNull()
  })

  it('ritorna oggetto valido se tutti i campi sono corretti', () => {
    const stock = [
      '',
      '\u003Ca href=\u0027\/en\/product\/equities\/IT0001233417-MTAA\u0027 data-order=\u0027A2A\u0027 data-title-hover=\u0027A2A\u0027\u003EA2A\u003C\/a\u003E',
      'IT0001233417',
      'A2A',
      '\u003Cdiv class=\u0027nowrap pointer\u0027 title=\u0027Euronext Milan\u0027 \u003EMTAA\u003C\/div\u003E',
      '\u003Cdiv class=\u0027text-right pd_currency_es\u0027\u003E \u003Cspan class=\u0027pd_last_price_es\u0027\u003E2.238\u003C\/span\u003E\u003C\/div\u003E',
      '\u003Cdiv class=\u0027text-right pd_percent\u0027\u003E\u003Cspan class=red\u003E-1.19%\u003C\/span\u003E\u003C\/div\u003E',
      '\u003Cdiv class=\u0027text-right pointer tooltipDesign\u0027 \u003E04 Jul 2025\u003Cspan class=\u0022tooltiptext\u0022\u003E17:35 CEST\u003C\/span\u003E\u003C\/div\u003E',
      '\u003Cdiv class=\u0022text-right\u0022\u003E2.238\u003C\/div\u003E',
      '\u003Cdiv class=\u0022text-right\u0022\u003E04 Jul 2025\u003C\/div\u003E'
    ]
    const result = filterStocksAndBuildData(stock)
    expect(result).toEqual({
      'code': 'A2A',
      'currency': null,
      'isin': 'IT0001233417',
      'market': 'Euronext Milan',
      'name': 'A2A',
      'slug': 'a2a'
    })
  })
})

describe('sendMessage', () => {
  const originalEnv = process.env
  vi.mock('mailgun.js')
  vi.mock('../../config/logger.js', () => ({
    default: {
      info: vi.fn(),
      error: vi.fn()
    }
  }))

  const mockCreate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    Mailgun.mockImplementation(() => ({
      client: () => ({
        messages: {
          create: mockCreate
        }
      })
    }))
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('logga il report e non invia email se non in ambiente production', async() => {
    process.env.NODE_ENV = 'development'

    const report = 'Report di test'
    await sendMessage(report)

    expect(logger.info).toHaveBeenCalledWith('Generated report:')
    expect(logger.info).toHaveBeenCalledWith(report)
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('invia l\'email in ambiente production', async() => {
    process.env.NODE_ENV = 'production'
    process.env.MAILGUN_SECRET_KEY = 'test-key'

    const report = 'Report di produzione'

    await sendMessage(report)

    expect(mockCreate).toHaveBeenCalledWith('ftt.tradingradar.net', {
      from: 'tradingradar.net <followthetitle@ftt.tradingradar.net>',
      to: 'Marco Pavan <marcopavan.mp@gmail.com>',
      subject: 'Rapporto update DB tradingradar',
      text: report
    })
  })

  it('logga un errore se la chiamata a Mailgun fallisce', async() => {
    process.env.NODE_ENV = 'production'
    process.env.MAILGUN_SECRET_KEY = 'test-key'

    const error = new Error('Errore di invio')
    mockCreate.mockRejectedValueOnce(error)

    const report = 'Report con errore'
    await sendMessage(report)

    expect(logger.error).toHaveBeenCalled()
    expect(logger.error.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(logger.error.mock.calls[0][0].message).toBe('Errore di invio')
  })
})

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
