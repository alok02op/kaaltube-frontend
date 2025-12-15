import axios from 'axios'
import conf from '../conf.js'

const api = axios.create({
    baseURL: conf.backend_url,
    withCredentials: true
});

const registerUser = async (data) => {
    try {
        await api.post('/api/v1/users/register', data)        
        return loginUser({...data});
    } catch (error) {
        console.log('Authentication Service :: registerUser error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const loginUser = async ({username, email, password}) => {
    try {
        const response = await api.post('/api/v1/users/login', { username, email, password })
        return response.data.data
    } catch (error) {
        console.log('Authentication Service :: loginUser error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const logoutUser = async () => {
    try {
        await api.patch('/api/v1/users/logout')
    } catch (error) {
        console.log('Backend Service :: logoutUser error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const getCurrentUser = async () => {
    try {
        const response =  await api.get('/api/v1/users/current-user')
        return response.data.data
    } catch (error) {
        console.log('Authentication Service :: getCurrentUser error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const changePassword = async ({currentPassword, newPassword}) => {
    try {
        const response = await api.post('/api/v1/users/change-password', { currentPassword, newPassword })
        return response.data.message
    } catch (error) {
        console.log('Authentication Service :: changePassword error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const updateProfile = async({fullName, username, email}) => {
    try {
        const response = await api.patch('/api/v1/users/update-account', { fullName, username, email })
        return response.data
    } catch (error) {
        console.log('Authentication Service :: updateProfile error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const updateAvatar = async (avatar) => {
    try {
        const response = await api.patch('/api/v1/users/avatar', {avatar})
        return response.data
    } catch (error) {
        console.log('Authentication Service :: updateAvatar error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const updateCoverImage = async (coverImage) => {
    try {
        const response = await api.patch('/api/v1/users/cover-image', {coverImage})
        return response.data
    } catch (error) {
        console.log('Authentication Service :: updateCoverImage error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const authService = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword,
    updateProfile,
    updateAvatar,
    updateCoverImage
}

export default authService