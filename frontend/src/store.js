import { configureStore } from '@reduxjs/toolkit';

import bookReducer from './reducers/bookReducer';
import articleReducer from './reducers/articleReducer';

const store = configureStore({
  reducer: {
    books: bookReducer,
    articles: articleReducer,
  },
});

export default store;
