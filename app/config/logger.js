import pino from 'pino'

const isDev = process.env.NODE_ENV === 'development'

const logger = isDev
  ? pino({
    level: process.env.LOG_LEVEL || 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard', // timestamp leggibile
        ignore: 'pid,hostname'         // rimuove info inutili in dev
      }
    }
  })
  : pino({
    level: process.env.LOG_LEVEL || 'info'
  })

// logger.info('App avviata')
// logger.warn('Attenzione!')
// logger.error(new Error('Qualcosa è andato storto'))
// logger.debug({ oggetto: 'debug info' }, 'Dettagli debug')

export default logger
