import { createSlice } from '@reduxjs/toolkit';
import articleLogService from '../services/articleLogs';

const articleLogSlice = createSlice({
  name: 'articleLogs',
  initialState: [],
  reducers: {
    articleLogsReset() {
      return initialState;
    },
    setArticleLogs(state, action) {
      return action.payload;
    },
    createArticleLog(state, action) {
      state.push(action.payload);
    },
    deleteArticleLog(state, action) {
      return state.filter(obj => obj.id !== action.payload);
    },
    updateArticleLog(state, action) {
      const id = action.payload.id;
      return state.map(obj => (obj.id !== id ? obj : action.payload));
    },
  },
});

const { setArticleLogs, deleteArticleLog, updateArticleLog } =
  articleLogSlice.actions;

export const initializeArticleLogs = () => {
  return async dispatch => {
    const articleLogs = await articleLogService.getAll();
    dispatch(setArticleLogs(articleLogs));
  };
};

export const { createArticleLog } = articleLogSlice.actions;

export default articleLogSlice.reducer;
