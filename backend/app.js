const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const middleware = require('./utils/middleware');

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const booksRouter = require('./controllers/books');
const articlesRouter = require('./controllers/articles');
const articleLogsRouter = require('./controllers/articleLogs');
const bookLogsRouter = require('./controllers/bookLogs');

const app = express();

app.use(express.static('dist'));
app.use(express.json());

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

mongoose.connect(config.MONGODB_URI, { family: 4 });

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many login attempts, try again later' },
});

app.use(middleware.tokenExtractor);
// app.use('/api/users', usersRouter);
app.use('/api/login', loginLimiter, loginRouter);
app.use('/api/books', middleware.userExtractor, booksRouter);
app.use('/api/articles', middleware.userExtractor, articlesRouter);
app.use('/api/articlelogs', middleware.userExtractor, articleLogsRouter);
app.use('/api/booklogs', middleware.userExtractor, bookLogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
