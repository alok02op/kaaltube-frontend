import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice.js'
import userVideoReducer from './userVideoSlice.js'
import videoReducer from './videoSlice.js'
import miniPlayerReducer from './miniPlayerSlice.js'
import channelReducer from './channelSlice.js'
import userChannelReducer from './userChannelSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        userVideo: userVideoReducer,
        video: videoReducer,
        miniPlayer: miniPlayerReducer,
        channels: channelReducer,
        userChannel: userChannelReducer
    }
})