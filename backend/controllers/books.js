const booksRouter = require('express').Router()
const Book = require('../models/book')

booksRouter.get('/', async (request, response) => {
  const books = await Book.find({})
  response.json(books)
})

booksRouter.post('/', async (request, response) => {
  const book = new Book(request.body)

  const savedBook = await book.save()
  response.status(201).json(savedBook)
})

module.exports = booksRouter