'use strict'
require('dotenv').config()
const { EventEmitter } = require('events')
const events = new EventEmitter()
const server = require('./server')
const error = require('./error')

// Error handling - on unhandled promise rejection
process.on('unhandledRejection', (reason, p) => {
  // Will be handled by uncaughtException err handler
  throw reason
})

// Error handling - on uncaught exception
process.on('uncaughtException', (err) => {
  error.handle(err)
  process.exit(1)
})

process.on('SIGINT', () => {
  process.exit(2)
})

// Cleanup
process.on('exit', async () => {
  events.emit('process:cleanup')
})

const start = async () => {
  try {
    // Start server
    const app = await server.start({ events })
    events.emit('server:ready', { app })
  } catch (err) {
    error.handle(err)
  }
}

start()

module.exports = { events }
