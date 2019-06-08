'use strict'
const fastify = require('fastify')
const HttpStatus = require('http-status-codes')
const api = require('./api')
const ws = require('./ws')
const error = require('./error')

const start = async ({ events }) => {
  if (!process.env.PORT) {
    throw new Error('server: no port specified')
  }

  const server = fastify()
  server.register(api) // API
  server.register(ws(events)) // WebSocket

  // Handle Not Found
  server.get('/*', (request, reply) => {
    reply.code(HttpStatus.NOT_FOUND).send({ error: 'Not found' })
  })

  // Handle Errors
  server.setErrorHandler((err, request, reply) => {
    error.handle(err)

    return reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' })
  })

  return server.listen(process.env.PORT, '::')
}

module.exports = { start }
