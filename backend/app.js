const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const morgan = require('morgan');
const middleware = require('./utils/middleware');

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const booksRouter = require('./controllers/books');
const articlesRouter = require('./controllers/articles');
const articleLogsRouter = require('./controllers/articleLogs');
const bookLogsRouter = require('./controllers/bookLogs');

const app = express();

app.use(express.json());

morgan.token('body', function (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

mongoose.connect(config.MONGODB_URI, { family: 4 });

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/books', booksRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/articlelogs', articleLogsRouter);
app.use('/api/booklogs', bookLogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
