const booksRouter = require('express').Router();
const Book = require('../models/book');
const BookLog = require('../models/bookLog');

booksRouter.get('/', async (request, response) => {
  const books = await Book.find({});
  response.json(books);
});

booksRouter.post('/', async (request, response) => {
  const book = new Book(request.body);

  const savedBook = await book.save();
  response.status(201).json(savedBook);
});

booksRouter.delete('/:id', async (request, response) => {
  const toDelete = await Book.findById(request.params.id);
  if (!toDelete) {
    return response.status(404).json({ error: 'book not found' });
  }
  await BookLog.deleteMany({ book: request.params.id });
  await Book.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

booksRouter.put('/:id', async (request, response) => {
  const updatedBook = await Book.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  if (!updatedBook) {
    return response.status(404).json({ error: 'book not found' });
  }
  response.json(updatedBook);
});

module.exports = booksRouter;
