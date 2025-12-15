import { createSlice } from '@reduxjs/toolkit'

const initialData = {
    id: '',
    fullName: '',
    username: '',
    subscriberCount: 0,
    videosCount: 0
}


const initialState = {
    info: initialData
}

const applyUserUpdate = (state, payload) => {
    if(payload?.username) state.info.username = payload.username
    if(payload?.fullName) state.info.fullName = payload.fullName
}

const userChannelSlice = createSlice({
    name: 'userChannel',
    initialState,
    reducers: {
        updateChannel: (state, action) => {
            applyUserUpdate(state, action.payload);
        },
        setUserChannel: (state, action) => {
            state.info = action.payload
        }
    }
})

export const {updateChannel, setUserChannel} = userChannelSlice.actions
export default userChannelSlice.reducer