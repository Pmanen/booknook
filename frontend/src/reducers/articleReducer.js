import { createSlice } from '@reduxjs/toolkit';
import articleService from '../services/articles';
import articleLogService from '../services/articleLogs';
import { createArticleLog, updateArticleLog } from './articleLogReducer';

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
      const newLog = await articleLogService.create({
        ...log,
        article: newArticle.id,
        readLength: newArticle.length,
      });
      dispatch(createArticleLog(newLog));
    } catch (e) {
      console.error(e.response.data);
    }
  };
};

export const editArticle = (article, log) => {
  return async dispatch => {
    console.log(article);
    console.log(log);
    /* try {
      const updatedArticle = await articleService.update(article);
      dispatch(updateArticle(updatedArticle));
      const updatedLog = await articleLogService.update({
        ...log,
        article: article.id,
        readLength: updatedArticle.length,
      });
      dispatch(updateArticleLog(updatedLog));
    } catch (e) {
      console.error(e.response.data);
    } */
  };
};

export default articleSlice.reducer;
