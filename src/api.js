'use strict'
const HttpStatus = require('http-status-codes')
const { normalizeTicker, normalizeTickers } = require('./utils')
const { getTicker, getTickers } = require('./apiService')

const API_ERRORS = {
  SYMBOL_INVALID: 'symbol: invalid'
}

const handleApiError = (e, reply) => {
  if (Array.isArray(e.error) && e.error.includes(API_ERRORS.SYMBOL_INVALID)) {
    reply.code(HttpStatus.BAD_REQUEST).send({ error: 'Invalid ticker' })
  } else {
    throw e
  }
}

const api = async (fastify, options) => {
  fastify.get('/tickers', async (request, reply) => {
    const res = await getTickers()

    return normalizeTickers(res)
  })

  fastify.get('/tickers/:symbol', async ({ params: { symbol } }, reply) => {
    let res
    try {
      res = await getTicker(symbol)
    } catch (e) {
      if (e.error) {
        handleApiError(e, reply)
        return
      }

      throw e
    }

    return normalizeTicker(res)
  })
}

module.exports = api
