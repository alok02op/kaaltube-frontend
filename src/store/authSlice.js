import { createSlice } from '@reduxjs/toolkit'

const initialData = {
    username: '',
    fullName: '',
    email: '',
    avatar: '',
    coverImage: ''
}

const initialState = {
    status: false,
    userData: initialData,
    loaded: false
}

const applyUserUpdate = (state, payload) => {
    if(payload?.username) state.userData.username = payload.username
    if(payload?.fullName) state.userData.fullName = payload.fullName
    if(payload?.email) state.userData.email = payload.email
    if(payload?.avatar) state.userData.avatar = payload.avatar
    if(payload?.coverImage) state.userData.coverImage = payload.coverImage
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true
            applyUserUpdate(state, action.payload);
        },
        logout: (state) => {
            state.status = false
            state.userData = initialData;
        },
        update: (state, action) => {
            applyUserUpdate(state, action.payload);
        },
        setAuthLoaded: (state, action) => {
            state.loaded = action.payload;
        }
    }
})

export const {login, logout, update, setAuthLoaded} = authSlice.actions
export default authSlice.reducer