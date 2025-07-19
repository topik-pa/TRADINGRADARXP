import { describe, it, expect, vi, beforeEach } from 'vitest'
import { feedDB } from '../../db/feedDB.js'
import * as fs from 'fs/promises'
// import { JSDOM } from 'jsdom'
import { upsertStock } from '../../controllers/stockController.js'
import { cleanDB } from '../../utilities/cleanDB.js'
import logger from '../../config/logger.js'
// import { sleep } from '../../utilities/sleep.js'

// MOCK delle dipendenze
vi.mock('fs/promises', () => ({
  readFile: vi.fn()
}))

vi.mock('../../controllers/stockController.js', () => ({
  upsertStock: vi.fn(() => Promise.resolve())
}))

vi.mock('../../utilities/cleanDB.js', () => ({
  cleanDB: vi.fn(() => Promise.resolve())
}))

vi.mock('../../config/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock('../../utilities/sleep.js', () => ({
  sleep: () => Promise.resolve()
}))


const mockHTML = `
  <div id="header-instrument-price">123.45</div>
  <div class="mt-auto">
    <span></span>
    <span>+1.23</span>
    <span>+2.34%</span>
  </div>
`

global.fetch = vi.fn(() => Promise.resolve({
  text: () => Promise.resolve(mockHTML)
}))

describe('feedDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should read stock data, fetch HTML, extract values, and update DB', async() => {
    fs.readFile.mockResolvedValue(JSON.stringify([
      {
        isin: 'TEST123',
        name: 'Test Stock',
        sources: ['https://example.com/stock']
      }
    ]))

    fetch.mockResolvedValue({
      text: () => Promise.resolve(mockHTML)
    })

    await feedDB()

    expect(fetch).toHaveBeenCalledWith('https://example.com/stock')

    expect(upsertStock).toHaveBeenCalledWith({
      isin: 'TEST123',
      price: '123.45',
      absVariation: '+1.23',
      relVariation: '+2.34%'
    })

    expect(cleanDB).toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Conneting to:'))
  })
})
