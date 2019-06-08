'use strict'
const { normalizeWsTicker } = require('./utils')
const wsService = require('./wsService')

const sendInvalidChannel = (connection) => connection.socket.send('Invalid ticker')

module.exports = (events) => {
  const {
    startListen,
    stopListen,
    WS_SERVICE_EVENTS
  } = wsService(events)

  const subscriptions = Object.create(null)
  const channels = Object.create(null)

  // Register subscriber for ticker's update
  const register = (connection, channel) => {
    if (!channel || !subscriptions[channel]) subscriptions[channel] = new Set()

    subscriptions[channel] = subscriptions[channel].add(connection)
    // Update channels' listeners
    onSubscriptionsUpdated()
  }

  // Unregister subscriber's connection from ticker's update
  const unregister = (connection, channel) => {
    if (channel) {
      if (!subscriptions[channel]) return false
      const hasSymbol = !!subscriptions[channel]

      if (hasSymbol) {
        removeSubscription(channel, connection)
      }
    } else {
      removeSubscriptionFromAll(connection)
    }

    // Update channels' listeners
    onSubscriptionsUpdated()
  }

  // Remove subscriber's connection
  const removeSubscription = (channel, connection) => {
    const isSubscribed = subscriptions[channel].has(connection)
    if (isSubscribed) {
      subscriptions[channel].delete(connection)
    }
  }

  // Remove subscriber's connection from all channels
  const removeSubscriptionFromAll = (connection) => {
    Object.keys(subscriptions).forEach((channel) => removeSubscription(channel, connection))
  }

  const updateChannelsListeners = (channel) => {
    if (channels[channel]) {
      // Remove channel's listener if there are no subscribers
      if (!subscriptions[channel] || !subscriptions[channel].size) {
        stopListen(channels[channel])
      }
    } else if (subscriptions[channel] && subscriptions[channel].size) {
      // Add channel's listener
      startListen(channel)
    }
  }

  // Handle subscriptions' updates
  const onSubscriptionsUpdated = () => {
    Object.keys(subscriptions).forEach(updateChannelsListeners)
  }

  const getChannelByChanId = (chanId) => Object.keys(channels)
    .find((channel) => channels[channel] === chanId)

  const eventHandlers = {
    // Handle wsService data received
    [WS_SERVICE_EVENTS.DATA_RECEIVED]: ([chanId, data]) => {
      const channel = getChannelByChanId(chanId)

      // Send the ticker's data to the subscribers
      const connections = subscriptions[channel]

      if (connections && connections.size) {
        const normalized = normalizeWsTicker(channel, data)
        connections.forEach((connection) => connection.socket.send(JSON.stringify(normalized)))
      }
    },
    // Handle wsService channel subscribed
    [WS_SERVICE_EVENTS.CHANNEL_SUBSCRIBED]: ({ symbol: channel, chanId }) => {
      channels[channel] = chanId
    },
    // Handle wsService channel unsubscribed
    [WS_SERVICE_EVENTS.CHANNEL_UNSUBSCRIBED]: ({ chanId }) => {
      const channel = getChannelByChanId(chanId)

      channels[channel] = null
    },
    // Handle wsService invalid channel error
    [WS_SERVICE_EVENTS.CHANNEL_INVALID]: ({ channel }) => {
      const connections = subscriptions[channel]
      connections.forEach(sendInvalidChannel)

      delete subscriptions[channel]
    }
  }

  // Attach event handlers for internal events
  Object.keys(eventHandlers).forEach((event) => events.on(event, eventHandlers[event]))

  // Cleanup on server exit
  events.on('process:cleanup', () => {
    // Close all channels' listeners
    Object.keys(channels).forEach((channel) => stopListen(channels[channel]))
  })

  return {
    register,
    unregister
  }
}
