import { configureStore } from '@reduxjs/toolkit';

import bookReducer from './reducers/bookReducer';
import articleReducer from './reducers/articleReducer';
import articleLogReducer from './reducers/articleLogReducer';

const store = configureStore({
  reducer: {
    books: bookReducer,
    articles: articleReducer,
    articleLogs: articleLogReducer,
  },
});

export default store;
