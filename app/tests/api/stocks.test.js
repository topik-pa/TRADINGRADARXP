/* eslint-disable no-undef */
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { app } from '../../../index.js'
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
      'absVariation': '-0.05',
      'price': '5.10',
      'relVariation': '-0.97%'
    },
    {
      '_id': '6878f2c89fc70686852ff782',
      'isin': 'BE0974278104',
      '__v': 0,
      'code': 'ABO',
      'currency': 'EUR',
      'market': 'Euronext Brussels, Paris',
      'name': 'ABO GROUP',
      'stockUrl': 'abo-group',
      'absVariation': '0.00',
      'price': '6.30',
      'relVariation': '0.00%'
    },
    {
      '_id': '6878f2c89fc70686852ff779',
      'isin': 'FR0013185857',
      '__v': 0,
      'code': 'ABEO',
      'currency': 'EUR',
      'market': 'Euronext Paris',
      'name': 'ABEO',
      'stockUrl': 'abeo',
      'absVariation': '+0.06',
      'price': '9.72',
      'relVariation': '+0.62%'
    }

  ])
})

describe('GET /api/stocks/', () => {
  it('should return a list of stock objects', async() => {
    const res = await request(app).get('/api/stocks/')
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(3)
    //expect(res.body[0]).toMatchObject({ symbol: 'AAPL', name: 'Apple Inc.' })
  })
})
