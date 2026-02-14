import { createSlice } from '@reduxjs/toolkit';
import bookService from '../services/books';

const bookSlice = createSlice({
  name: 'books',
  initialState: [],
  reducers: {
    booksReset() {
      return initialState;
    },
    setBooks(state, action) {
      return action.payload;
    },
    createBook(state, action) {
      state.push(action.payload);
    },
    deleteBook(state, action) {
      return state.filter(obj => obj.id !== action.payload);
    },
    updateBook(state, action) {
      const id = action.payload.id;
      return state.map(obj => (obj.id !== id ? obj : action.payload));
    },
  },
});

const { setBooks, createBook, deleteBook, updateBook } = bookSlice.actions;

export const initializeBooks = () => {
  return async dispatch => {
    const books = await bookService.getAll();
    dispatch(setBooks(books));
  };
};

export default bookSlice.reducer;
