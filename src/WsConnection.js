'use strict'

module.exports = class {
  constructor (connection) {
    this.connection = connection
  }

  send (data) {
    this.connection.socket.send(data)
  }

  error (error) {
    this.send(JSON.stringify({ error }))
  }
}
