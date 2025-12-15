import { createSlice } from '@reduxjs/toolkit'

// const video = {
//     id: 1,
//     thumbnailUrl: '',
//     title: '',
//     description: '',
//     likes: 0,
//     views: 0,
//     isPublished: false,
//     createdAt: '',
//     updatedAt: ''
// }

const initialState = {
    videos: [],
    likedVideos: [],
    watchHistory: []
}

const applyVideoUpdate = (video, payload) => {
    const fields = [ 
        "thumbnailUrl", 
        "title", 
        "description", 
        "likes", 
        "views", 
        "isPublished",
        "updatedAt"
    ];
    fields.forEach((field) => {
        if (payload[field] !== undefined) {
            video[field] = payload[field];
        }
    });
};

const videoSlice = createSlice({
    name: 'userVideo',
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.videos = action.payload
        },
        addVideo: (state, action) => {
            state.videos.unshift(action.payload); 
        },
        removeVideo: (state, action) => {
            state.videos = state.videos.filter(video => video.id !== action.payload)
        },
        updateVideo: (state, action) => {
            const video = state.videos.find(v => v.id === action.payload.id);
            if (video) applyVideoUpdate(video, action.payload);
        },
        setLikedVideos: (state, action) => {
            state.likedVideos = action.payload;
        },
        addToLikedVideos: (state, action) => {
            const video = action.payload;
            const exists = (state.likedVideos || []).some(v => v.id === video.id);
            if (!exists) {
                state.likedVideos.unshift(video);
            }
        },
        removeFromLikedVideos: (state, action) => {
            state.likedVideos = state.likedVideos.filter(v => v.id !== action.payload);
        },
        setWatchHistory: (state, action) => {
            state.watchHistory = action.payload
        },
        addToWatchHistory: (state, action) => {
            const video = action.payload;
            const exists = (state.watchHistory || []).some(v => v.id === video.id);
            if (!exists) {
                state.watchHistory.unshift(video);
            }
        },
        removeFromWatchHistory: (state, action) => {
            state.watchHistory = state.watchHistory.filter(v => v.id !== action.payload);
        },
        clearVideos: (state) => {
            state.videos = []
            state.likedVideos = []
            state.watchHistory = []
        },
    }
})

export const {
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
} = videoSlice.actions
export default videoSlice.reducer