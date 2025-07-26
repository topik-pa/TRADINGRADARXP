import express from 'express'
import { getStockByISIN, getStocksByMarket, getStocks } from '../controllers/api.controller.js'
const router = express.Router()


router.get('/stocks/:exchange(milan|oslo|paris|amsterdam|brussels|lisbon|dublin)', getStocksByMarket)

router.get('/stocks/:isin', getStockByISIN)

router.get('/stocks/', getStocks)



export default router
