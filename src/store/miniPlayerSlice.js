import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  video: null,
};

const miniPlayerSlice = createSlice({
  name: 'miniPlayer',
  initialState,
  reducers: {
    openMiniPlayer: (state, action) => {
      state.isOpen = true;
      state.video = action.payload;
    },
    closeMiniPlayer: (state) => {
      state.isOpen = false;
      state.video = null;
    }
  },
});

export const { openMiniPlayer, closeMiniPlayer, restoreMiniPlayer } = miniPlayerSlice.actions;
export default miniPlayerSlice.reducer;
