const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const morgan = require('morgan')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())

morgan.token('body', function (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

mongoose.connect(config.MONGODB_URI, { family: 4 })

app.use(middleware.unknownEndpoint)

module.exports = app