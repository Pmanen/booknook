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

articlesRouter.delete('/:id', async (request, response) => {
  const toDelete = await Article.findById(request.params.id);
  if (!toDelete) {
    return response.status(404).json({ error: 'article not found' });
  }
  await Article.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

articlesRouter.put('/:id', async (request, response) => {
  const updatedArticle = await Article.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  );
  if (!updatedArticle) {
    return response.status(404).json({ error: 'article not found' });
  }
  response.json(updatedArticle);
});

module.exports = articlesRouter;
