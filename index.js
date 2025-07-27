import logger from './app/config/logger.js'
import { app } from './server.js'

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`)
})
