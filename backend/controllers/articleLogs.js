const articleLogsRouter = require('express').Router();
const { request } = require('../app');
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

articleLogsRouter.delete('/:id', async (request, response) => {
  const logToDelete = await ArticleLog.findById(request.params.id);
  if (!logToDelete) {
    return response.status(404).json({ error: 'log not found' });
  }
  await ArticleLog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

articleLogsRouter.put('/:id', async (request, response) => {
  const updatedArticleLog = await ArticleLog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  ).populate('article', {
    title: 1,
    author: 1,
    outlet: 1,
    url: 1,
    dateAdded: 1,
    datePublished: 1,
    genreTag: 1,
  });
  if (!updatedArticleLog) {
    return response.status(404).json({ error: 'article log not found' });
  }
  response.json(updatedArticleLog);
});

module.exports = articleLogsRouter;
