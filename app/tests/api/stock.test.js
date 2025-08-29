/* eslint-disable no-undef */
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { app } from '../../../server.js'
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
  await Stock.create([
    {
      '_id': '6878f2c89fc70686852ff76f',
      'isin': 'IT0005439861',
      '__v': 0,
      'code': 'ABP',
      'currency': 'EUR',
      'market': 'Euronext Growth Milan',
      'name': 'A.B.P. NOCIVELLI',
      'stockUrl': 'a-b-p--nocivelli',
      'absVariation': -0.05,
      'price': 5.10,
      'relVariation': -0.97,
      'perf1M': -4.35,
      'perf52W': 60.29
    }
  ])
})

describe('GET stock by stock fragment', () => {
  it('should return a stock object', async() => {
    const res = await request(app).get('/api/stocks/a-b-p--nocivelli')
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({
      '_id': '6878f2c89fc70686852ff76f',
      'isin': 'IT0005439861',
      '__v': 0,
      'code': 'ABP',
      'currency': 'EUR',
      'market': 'Euronext Growth Milan',
      'name': 'A.B.P. NOCIVELLI',
      'stockUrl': 'a-b-p--nocivelli',
      'absVariation': -0.05,
      'price': 5.10,
      'relVariation': -0.97,
      'perf1M': -4.35,
      'perf52W': 60.29
    })
  })
})

describe('GET /api/stocks/not-existent-stock', () => {
  it('should return a 404 if wrong isin', async() => {
    const res = await request(app).get('/api/stocks/0123456789')
    expect(res.statusCode).toBe(404)
    expect(res.body).toMatchObject({
      'error': 404,
      'message': 'Resource not found'
    })
  })
})
