'use strict'
const HttpStatus = require('http-status-codes')
const SseConnection = require('../adapters/SseConnection')

const sse = ({ subscribe, unsubscribe }) => {
  return async (fastify, options) => {
    fastify.get('/event-stream/:symbol', async (request, reply) => {
      const { params: { symbol } } = request

      const sseConnection = new SseConnection(reply)

      reply
        .res // The http.ServerResponse from Node core.
        .writeHead(HttpStatus.OK, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        })

      subscribe(sseConnection, symbol)

      request
        .req // The http.ServerRequest from Node core.
        .on('close', () => {
          unsubscribe(sseConnection, symbol)
        })
    })
  }
}

module.exports = sse
