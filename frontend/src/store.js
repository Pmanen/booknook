import { configureStore } from '@reduxjs/toolkit';

import bookReducer from './reducers/bookReducer';
import articleReducer from './reducers/articleReducer';
import articleLogReducer from './reducers/articleLogReducer';
import bookLogReducer from './reducers/bookLogReducer';
import sessionReducer from './reducers/sessionReducer';

const store = configureStore({
  reducer: {
    books: bookReducer,
    articles: articleReducer,
    articleLogs: articleLogReducer,
    bookLogs: bookLogReducer,
    session: sessionReducer,
  },
});

export default store;
