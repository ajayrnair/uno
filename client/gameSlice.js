import { createSlice } from '@reduxjs/toolkit'

export const gameSlice = createSlice({
  name: 'game',
  initialState: {game: null},
  reducers: {
    updateGame: (state, {payload}) => {
      state.game = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateGame} = gameSlice.actions;

export default gameSlice.reducer;
