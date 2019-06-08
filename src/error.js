'use strict'
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'stock-ticker' })

const handle = (err) => {
  // Log to the console
  log.error(err)
}

module.exports = { handle }
