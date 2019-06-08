/* eslint-env mocha */
'use strict'

require('dotenv').config()
const { EventEmitter } = require('events')
const events = new EventEmitter()
const supertest = require('supertest')
const should = require('should')
const server = require('../src/server')

describe('Server', () => {
  const api = supertest('http://localhost:3000')

  before(async () => {
    return server.start({ events })
  })

  it('should return 200', (done) => {
    api.get('/tickers')
      .expect(200, done)
  })

  it('should return 200', (done) => {
    api.get('/tickers/tBTCUSD')
      .expect((res) => {
        res.body.should.be.Array()
        res.body.should.has.lengthOf(1)
      })
      .expect(200, done)
  })

  it('should return 404', (done) => {
    api.get('/wrong-url')
      .expect(404, done)
  })

  it('should return 400', (done) => {
    api.get('/tickers/invalidTicker')
      .expect(400, done)
  })
})
