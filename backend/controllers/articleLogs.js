const articleLogsRouter = require('express').Router();
const ArticleLog = require('../models/articleLog');

articleLogsRouter.get('/', async (request, response) => {
  const articleLogs = await ArticleLog.find({}).populate('article', {
    title: 1,
    author: 1,
    outlet: 1,
    url: 1,
    dateAdded: 1,
    datePublished: 1,
    genreTag: 1,
  });
  response.json(articleLogs);
});

articleLogsRouter.post('/', async (request, response) => {
  const articleLog = new ArticleLog(request.body);

  const savedArticleLog = await articleLog.save();
  await savedArticleLog.populate('article', {
    title: 1,
    author: 1,
    outlet: 1,
    url: 1,
    dateAdded: 1,
    datePublished: 1,
    genreTag: 1,
  });
  response.status(201).json(savedArticleLog);
});

module.exports = articleLogsRouter;
