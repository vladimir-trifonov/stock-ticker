'use strict'
const rp = require('request-promise')

const getTicker = (symbol) => rp({
  url: `${process.env.BITFINEX_URL}/ticker/${symbol}`,
  json: true
})

const getTickers = () => rp({
  url: `${process.env.BITFINEX_URL}/tickers?symbols=ALL`,
  json: true
})

module.exports = {
  getTicker,
  getTickers
}
