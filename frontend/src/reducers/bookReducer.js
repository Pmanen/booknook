import { createSlice } from '@reduxjs/toolkit';
import bookService from '../services/books';
import { appendBookLog } from './bookLogReducer';

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

export const removeBook = id => {
  return async dispatch => {
    try {
      await bookService.remove(id);
      dispatch(deleteBook(id));
    } catch (error) {
      console.error('Error deleting book:', error.response ? error.response.data : error.message);
    }
  };
};

export const modifyBook = book => {
  return async dispatch => {
    try {
      const updatedBook = await bookService.update(book);
      dispatch(updateBook(updatedBook));
    } catch (error) {
      console.error('Error updating book:', error.response ? error.response.data : error.message);
    }
  };
};

export const appendBook = book => {
  return async dispatch => {
    try {
      const newBook = await bookService.create({
        title: book.title,
        author: book.author,
        yearPublished: book.yearPublished,
        pages: book.pages,
        genreTag: book.genreTag,
      });
      dispatch(createBook(newBook));
      if (book.currentPage) {
        const newLog = {
          book: newBook.id,
          currentPage: Math.min(book.currentPage, newBook.pages),
          finished: book.currentPage >= newBook.pages,
          date: '2025-01-01T00:00:00.000Z',
        };
        dispatch(appendBookLog(newLog));
      }
    } catch (error) {
      console.error(
        'Error creating book:',
        error.response ? error.response.data : error.message
      );
    }
  };
};

export default bookSlice.reducer;
