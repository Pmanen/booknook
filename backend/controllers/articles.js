const articlesRouter = require('express').Router();
const Article = require('../models/article');

articlesRouter.get('/', async (request, response) => {
  const articles = await Article.find({});
  response.json(articles);
});

articlesRouter.post('/', async (request, response) => {
  const article = new Article(request.body);

  const savedArticle = await article.save();
  response.status(201).json(savedArticle);
});

module.exports = articlesRouter;
