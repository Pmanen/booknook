import { createSlice } from '@reduxjs/toolkit';
import bookLogService from '../services/bookLogs';

const bookLogSlice = createSlice({
  name: 'bookLogs',
  initialState: [],
  reducers: {
    setBookLogs(state, action) {
      return action.payload;
    },
    createBookLog(state, action) {
      state.push(action.payload);
    },
    deleteBookLog(state, action) {
      return state.filter(obj => obj.id !== action.payload);
    },
    updateBookLog(state, action) {
      const id = action.payload.id;
      return state.map(obj => (obj.id !== id ? obj : action.payload));
    },
  },
});

const { setBookLogs } = bookLogSlice.actions;

export const initializeBookLogs = () => {
  return async dispatch => {
    const bookLogs = await bookLogService.getAll();
    dispatch(setBookLogs(bookLogs));
  };
};

export const { createBookLog } = bookLogSlice.actions;

export default bookLogSlice.reducer;
