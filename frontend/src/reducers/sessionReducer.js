import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'session',
  initialState: { user: null },
  reducers: {
    setUser(state, action) {
      return {
        ...state,
        user: action.payload,
      };
    },
    resetUser(state) {
      return {
        ...state,
        user: null,
      };
    },
  },
});

export const { setUser, resetUser } = sessionSlice.actions;

export default sessionSlice.reducer;
