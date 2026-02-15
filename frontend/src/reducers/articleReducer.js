import { createSlice } from '@reduxjs/toolkit';
import articleService from '../services/articles';
import articleLogService from '../services/articleLogs';

const articleSlice = createSlice({
  name: 'articles',
  initialState: [],
  reducers: {
    articlesReset() {
      return initialState;
    },
    setArticles(state, action) {
      return action.payload;
    },
    createArticle(state, action) {
      state.push(action.payload);
    },
    deleteArticle(state, action) {
      return state.filter(obj => obj.id !== action.payload);
    },
    updateArticle(state, action) {
      const id = action.payload.id;
      return state.map(obj => (obj.id !== id ? obj : action.payload));
    },
  },
});

const { setArticles, createArticle, deleteArticle, updateArticle } =
  articleSlice.actions;

export const initializeArticles = () => {
  return async dispatch => {
    const articles = await articleService.getAll();
    dispatch(setArticles(articles));
  };
};

export const appendArticle = (article, log) => {
  return async dispatch => {
    try {
      const newArticle = await articleService.create(article);
      dispatch(createArticle(article));
      console.log('article created');
      const newLog = await articleLogService.create({
        ...log,
        article: newArticle.id,
        readLength: newArticle.length,
      });
      console.log(newLog);
    } catch (e) {
      console.error(e);
    }
  };
};

export default articleSlice.reducer;
