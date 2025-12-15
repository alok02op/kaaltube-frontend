import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channelList: []
};

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    subscribeChannel: (state, action) => {
      const channel = action.payload;
      const exists = state.channelList.some(
        ch => ch.id === channel.id
      );
      if (!exists) {
        state.channelList.unshift(channel);
      }
    },

    unsubscribeChannel: (state, action) => {
      const channelId = action.payload;
      state.channelList = state.channelList.filter(ch => ch.id !== channelId);
    },

    setChannelList: (state, action) => {
      state.channelList = action.payload || [];
    }
  },
});

export const { subscribeChannel, unsubscribeChannel, setChannelList } = channelSlice.actions;
export default channelSlice.reducer;
