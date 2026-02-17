const bookLogsRouter = require('express').Router();
const BookLog = require('../models/bookLog');

bookLogsRouter.get('/', async (request, response) => {
  const bookLogs = await BookLog.find({}).populate('book', {
    title: 1,
    author: 1,
    dateAdded: 1,
    pages: 1,
    yearPublished: 1,
    genreTag: 1,
  });
  response.json(bookLogs);
});

bookLogsRouter.post('/', async (request, response) => {
  const bookLog = new BookLog(request.body);
  const previousLog = await BookLog.findOne({
    book: bookLog.book,
  }).sort({ date: -1 });
  bookLog.readLength = bookLog.currentPage - (previousLog?.currentPage || 0);

  if (bookLog.currentPage <= 0) {
    return response.status(400).json({ error: `page must be positive` });
  } else if (bookLog.readLength <= 0) {
    return response.status(400).json({
      error: `current page ${bookLog.currentPage} must be larger than previously read page ${previousLog.currentPage}`,
    });
  }

  const savedBookLog = await bookLog.save();
  await savedBookLog.populate('book', {
    title: 1,
    author: 1,
    dateAdded: 1,
    pages: 1,
    yearPublished: 1,
    genreTag: 1,
  });
  response.status(201).json(savedBookLog);
});

bookLogsRouter.delete('/:id', async (request, response) => {
  const logToDelete = await BookLog.findById(request.params.id);
  if (!logToDelete) {
    return response.status(404).json({ error: 'log not found' });
  }
  await BookLog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = bookLogsRouter;
