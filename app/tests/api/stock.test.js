/* eslint-disable no-undef */
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../../../index.js'
import { Stock } from '../../models/Stock.js'

let mongoServer

beforeAll(async() => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async() => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

beforeEach(async() => {
  await Stock.deleteMany() // pulizia prima di ogni test
})

describe('GET /api/stock/IT0005439861', () => {
  it('should return a list of stocks', async() => {
    await Stock.create([
      {
        '_id': '6878f2c89fc70686852ff76f',
        'isin': 'IT0005439861',
        '__v': 0,
        'code': 'ABP',
        'createdAt': '2025-07-17T12:55:36.289Z',
        'currency': 'EUR',
        'market': 'Euronext Growth Milan',
        'name': 'A.B.P. NOCIVELLI',
        'updatedAt': '2025-07-17T16:42:10.326Z',
        'absVariation': '-0.05',
        'price': '5.10',
        'relVariation': '-0.97%'
      }
    ])

    const res = await request(app).get('/api/stock/IT0005439861')

    expect(res.statusCode).toBe(200)
    // expect(res.body.length).toBe(1)
    // expect(res.body[0]).toMatchObject({ symbol: 'AAPL', name: 'Apple Inc.' })
  })
})