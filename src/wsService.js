'use strict'
var WsClient = require('ws-reconnect')
const error = require('./error')

const WS_SERVICE_EVENTS = {
  DATA_RECEIVED: 'ws_service:data_received',
  CHANNEL_SUBSCRIBED: 'ws_service:channel_subscribed',
  CHANNEL_UNSUBSCRIBED: 'ws_service:channel_unsubscribed',
  CHANNEL_INVALID: 'ws_service:channel_invalid',
  CLIENT_CONNECTED: 'ws_service:client_connected',
  CLIENT_DESTROYED: 'ws_service:client_destroyed'
}

const CLIENT_EVENTS = {
  ERROR: 'error',
  SUBSCRIBE: 'subscribe',
  SUBSCRIBED: 'subscribed',
  UNSUBSCRIBE: 'unsubscribe',
  UNSUBSCRIBED: 'unsubscribed'
}

const CLIENT_ERRORS = {
  SYMBOL_INVALID: 'symbol: invalid'
}

const CLIENT_CHANNEL_TYPE = 'ticker'

module.exports = (events) => {
  const client = new WsClient(process.env.BITFINEX_WS_URL, {
    retryCount: 20,
    reconnectInterval: 10
  })
  client.start()

  // On new message from the Trader
  client.on('message', (msg) => {
    let parsed

    try {
      parsed = JSON.parse(msg)
    } catch (e) {
      error.handle(e)
    }

    if (parsed) {
      handleClientMessage(parsed, msg)
    }
  })

  client.on('connect', () => {
    events.emit(WS_SERVICE_EVENTS.CLIENT_CONNECTED)
  })

  client.on('destroyed', () => {
    events.emit(WS_SERVICE_EVENTS.CLIENT_DESTROYED)
  })

  // Handle Trader's message
  const handleClientMessage = (data, originalMessage) => {
    if (data.event === CLIENT_EVENTS.ERROR) {
      handleClientError(data, originalMessage)
      return
    }

    if (Array.isArray(data)) {
      events.emit(WS_SERVICE_EVENTS.DATA_RECEIVED, data)
    } else if (data.event === CLIENT_EVENTS.SUBSCRIBED) {
      events.emit(WS_SERVICE_EVENTS.CHANNEL_SUBSCRIBED, data)
    } else if (data.event === CLIENT_EVENTS.UNSUBSCRIBED) {
      events.emit(WS_SERVICE_EVENTS.CHANNEL_UNSUBSCRIBED, data)
    }
  }

  const handleClientError = (data, originalMessage) => {
    if (data.msg === CLIENT_ERRORS.SYMBOL_INVALID) {
      events.emit(WS_SERVICE_EVENTS.CHANNEL_INVALID, { channel: data.symbol })
    } else {
      error.handle(originalMessage)
    }
  }

  // Subscribe to Trader ticker's channel
  const startListen = (channel) => {
    if (!client.isConnected) return
    client.send(JSON.stringify({
      event: CLIENT_EVENTS.SUBSCRIBE,
      channel: CLIENT_CHANNEL_TYPE,
      symbol: channel
    }))
  }

  // Unubscribe from Trader ticker's channel
  const stopListen = (chanId) => {
    if (!client.isConnected) return
    client.send(JSON.stringify({
      event: CLIENT_EVENTS.UNSUBSCRIBE,
      chanId
    }))
  }

  return {
    startListen,
    stopListen,
    WS_SERVICE_EVENTS
  }
}
