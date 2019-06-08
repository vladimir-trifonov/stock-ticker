'use strict'

const MAP_DATA = {
  TICKER_LAST_PRICE_INDEX: 6,
  TICKER_SYMBOL_INDEX: 0,
  TICKERS_LAST_PRICE_INDEX: 7
}

const normalizeTicker = (ticker = []) => {
  return [ticker[MAP_DATA.TICKER_LAST_PRICE_INDEX]]
}

const normalizeTickers = (tickers = []) => {
  return tickers.reduce((normalized, current) => {
    return [
      ...normalized,
      [current[MAP_DATA.TICKER_SYMBOL_INDEX], current[MAP_DATA.TICKERS_LAST_PRICE_INDEX]]
    ]
  }, [])
}

const normalizeWsTicker = (channel, ticker = []) => {
  if (typeof ticker === 'string') return [channel, ticker]
  return [channel, ticker[MAP_DATA.TICKER_LAST_PRICE_INDEX]]
}

module.exports = { normalizeTicker, normalizeTickers, normalizeWsTicker }
