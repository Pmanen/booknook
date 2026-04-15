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

const { setBookLogs, createBookLog, deleteBookLog } = bookLogSlice.actions;

export { deleteBookLog };

export const initializeBookLogs = () => {
  return async dispatch => {
    const bookLogs = await bookLogService.getAll();
    dispatch(setBookLogs(bookLogs));
  };
};

export const appendBookLog = log => {
  return async dispatch => {
    try {
      const newLog = await bookLogService.create(log);
      dispatch(createBookLog(newLog));
    } catch (e) {
      console.error(e.response.data);
    }
  };
};

export const removeBookLog = id => {
  return async dispatch => {
    try {
      await bookLogService.remove(id);
      dispatch(deleteBookLog(id));
    } catch (e) {
      console.error(e.response?.data);
    }
  };
};

export default bookLogSlice.reducer;
