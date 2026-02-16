import { configureStore } from '@reduxjs/toolkit';

import bookReducer from './reducers/bookReducer';
import articleReducer from './reducers/articleReducer';
import articleLogReducer from './reducers/articleLogReducer';
import bookLogReducer from './reducers/bookLogReducer';

const store = configureStore({
  reducer: {
    books: bookReducer,
    articles: articleReducer,
    articleLogs: articleLogReducer,
    bookLogs: bookLogReducer,
  },
});

export default store;
