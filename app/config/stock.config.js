import fs from 'fs/promises'
import logger from '../config/logger.js'

async function getRawData(path) {
  let raw
  try {
    raw = await fs.readFile(path, 'utf-8')
  } catch (error) {
    logger.error(new Error(error.message))
  }
  return raw
}
const stockSources = JSON.parse(await getRawData('./app/utilities/json-sources/output.json'))

export default stockSources
