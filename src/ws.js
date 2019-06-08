'use strict'
const fastifyWebSocket = require('fastify-websocket')
const subscriptions = require('./wsSubscriptions')

const WS_EVENTS = {
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe'
}

const sendWrongFormat = (connection) => connection.socket.send(
  'Wrong format. Example: {"event": "subscribe", "symbol": "tBTCUSD"}'
)

const ws = (events) => {
  const { register, unregister } = subscriptions(events)

  const eventHandlers = {
    [WS_EVENTS.SUBSCRIBE]: (connection, data) => {
      if (typeof data.symbol !== 'string' || data.symbol === '') {
        return sendWrongFormat(connection)
      }
      // Subscribe connection for tickers' updates
      register(connection, data.symbol)
    },
    [WS_EVENTS.UNSUBSCRIBE]: (connection, parsed) => {
      // Unsubscribe connection from tickers' updates
      unregister(connection, parsed.symbol)
    }
  }

  return async (fastify, options) => {
    const handle = (connection) => {
      connection.socket.on('message', message => {
        let parsed
        try {
          parsed = JSON.parse(message)
        } catch (e) {
          sendWrongFormat(connection)
        }

        if (parsed) {
          const hasHandler = Object.keys(eventHandlers).includes(parsed.event)

          if (hasHandler) eventHandlers[parsed.event](connection, parsed)
          else sendWrongFormat(connection)
        }
      })

      connection.socket.on('close', message => {
        // Unsubscribe connection from all
        // updates being registered
        unregister(connection)
      })
    }

    fastify.register(fastifyWebSocket, {
      handle,
      options: { path: '/ws' }
    })
  }
}

module.exports = ws
