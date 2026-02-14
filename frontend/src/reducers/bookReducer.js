import { createSlice } from '@reduxjs/toolkit'

const bookSlice = createSlice({
  name: 'books',
  initialState: [],
  reducers: {
    booksReset() {
      return initialState
    }
  }
})


export default bookSlice.reducer