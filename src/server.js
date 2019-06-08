'use strict'
const fastify = require('fastify')
const HttpStatus = require('http-status-codes')
const api = require('./handlers/api')
const ws = require('./handlers/ws')
const sse = require('./handlers/sse')
const subscriptions = require('./handlers/subscriptions')
const error = require('./error')

const start = async ({ events }) => {
  if (!process.env.PORT) {
    throw new Error('server: no port specified')
  }

  // Connect to the Trader's ws service
  const { subscribe, unsubscribe } = subscriptions(events)

  const server = fastify()
  server.register(api) // API
  server.register(ws({ subscribe, unsubscribe })) // WebSocket
  server.register(sse({ subscribe, unsubscribe })) // Server-Sent Events

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
