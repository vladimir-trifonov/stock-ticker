'use strict'
const HttpStatus = require('http-status-codes')

module.exports = class {
  constructor (connection) {
    this.connection = connection
  }

  send (data) {
    this.connection.res.write(`${data}\n`)
  }

  error (error) {
    this.connection.res.writeHead(HttpStatus.BAD_REQUEST, {
      'Content-Type': 'application/json'
    })
    this.connection.res.end(JSON.stringify({ error }))
  }
}
