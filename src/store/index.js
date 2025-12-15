import { store } from "./store";
import { login, logout, update, setAuthLoaded } from "./authSlice.js";
import {
    setVideos, 
    addVideo, 
    removeVideo, 
    updateVideo,
    setLikedVideos,
    addToLikedVideos,
    removeFromLikedVideos,
    setWatchHistory,
    addToWatchHistory,
    removeFromWatchHistory,
    clearVideos
} from './userVideoSlice.js'
import {
    setAllVideos,
    addToAllVideos,
    removeFromAllVideos,
} from './videoSlice.js'
import {
    openMiniPlayer,
    closeMiniPlayer,
    restoreMiniPlayer
} from './miniPlayerSlice.js'
import {
    subscribeChannel,
    unsubscribeChannel,
    setChannelList
} from './channelSlice.js'

import {
    setUserChannel,
    updateChannel
} from './userChannelSlice.js'

export {
    store,
    login,
    logout,
    update,
    setAuthLoaded,
    setVideos, 
    addVideo, 
    removeVideo, 
    updateVideo,
    setLikedVideos,
    addToLikedVideos,
    removeFromLikedVideos,
    setWatchHistory,
    addToWatchHistory,
    removeFromWatchHistory,
    setAllVideos,
    addToAllVideos,
    removeFromAllVideos,
    clearVideos,
    openMiniPlayer,
    closeMiniPlayer,
    restoreMiniPlayer,
    subscribeChannel,
    unsubscribeChannel,
    setChannelList,
    setUserChannel,
    updateChannel
}