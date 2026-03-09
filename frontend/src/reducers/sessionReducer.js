import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'session',
  initialState: { username: null },
  reducers: {
    setUser(state, action) {
      return {
        username: action.payload,
      };
    },
    resetUser() {
      return { username: null };
    },
  },
});

export const { setUser, resetUser } = sessionSlice.actions;

export default sessionSlice.reducer;
