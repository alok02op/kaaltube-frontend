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
//     updatedAt: '',
//     owner: {username: '', fullName: ''}
// }

const initialState = {
    allVideos: [],
}

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setAllVideos: (state, action) => {
            state.allVideos = action.payload
        },
        addToAllVideos: (state, action) => {
            const video = action.payload;

            // Remove if it already exists
            state.allVideos = state.allVideos.filter(v => v.id !== video.id);

            // Insert and sort by createdAt descending
            state.allVideos = [video, ...state.allVideos].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            // Keep only 50 most recent
            if (state.allVideos.length > 50) {
                state.allVideos = state.allVideos.slice(0, 50);
            }
        },
        removeFromAllVideos: (state, action) => {
            state.allVideos = state.allVideos.filter(video => video.id !== action.payload)
        }
    }
})

export const {
    setAllVideos,
    addToAllVideos,
    removeFromAllVideos,
} = videoSlice.actions
export default videoSlice.reducer