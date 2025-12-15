import axios from 'axios'
import conf from '../conf.js'

const api = axios.create({
    baseURL: conf.backend_url,
    withCredentials: true
});

const uploadVideo = async (data) => {
    try {
        const response = await api.post('/api/v1/videos/post-video', data)        
        return response.data
    } catch (error) {
        console.log('Video Service :: uploadVideo error : ', error.response?.data?.message || error.message);
        throw error
    }
};

const getUserVideos = async () => {
    try {
        const response = await api.get('/api/v1/videos/get-user-videos')        
        return response.data.data
    } catch (error) {
        console.log('Video Service :: getUserVideos error : ', error.response?.data?.message || error.message);
        throw error
    }
};

const getAllVideos = async () => {
    try {
        const response = await api.get('/api/v1/videos/get-all-videos')        
        return response.data.data
    } catch (error) {
        console.log('Video Service :: getAllVideos error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const togglePublishStatus = async (videoId) => {
    try {
        const response = await api.patch(`/api/v1/videos/toggle/publish/${videoId}`)
        return response.data.data
    } catch (error) {
        console.log('Video Service :: togglePublishStatus error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const getVideoById = async (videoId) => {
    try {
        const response = await api.get('/api/v1/videos/getVideo', {params: { videoId } })
        return response.data
    } catch (error) {
        console.log('Video Service :: getVideoById error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const deleteVideo = async (videoId) => {
    try {
        const response = await api.delete(`/api/v1/videos/${videoId}`)
        return response.data?.message;
    } catch (error) {
        console.log('Video Service :: deleteVideo error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const updateVideo = async (video) => {
    try {
        const response = await api.patch('/api/v1/videos/${video.id}', {...video})
        return response.data;
    } catch (error) {
        console.log('Video Service :: updateVideo error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const getWatchHistory = async () => {
    try {
        const response = await api.get('/api/v1/videos/watch-history')        
        return response.data.data
    } catch (error) {
        console.log('Video Service :: getWatchHistory error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const getLikedVideos = async () => {
    try {
        const response = await api.get('/api/v1/likes/videos')        
        return response.data.data
    } catch (error) {
        console.log('Video Service :: getLikedVideos error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const toggleVideoLike = async (videoId) => {
    try {
        const response = await api.patch(`/api/v1/likes/toggle/video/${videoId}`)
        return response.data
    } catch (error) {
        console.log('Video Service :: toggleVideoLike error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const removeFromWatchHistory = async (videoId) => {
    try {
        const response = await api.patch(`/api/v1/videos/watch-history/${videoId}`)
        return response.data?.message;
    } catch (error) {
        console.log('Video Service :: removeFromWatchHistory error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const removeFromLikedVideos = async (videoId) => {
    try {
        const response = await api.delete(`/api/v1/likes/delete/${videoId}`)
        return response.data?.message;
    } catch (error) {
        console.log('Video Service :: removeFromLikedVideos error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const videoService = {
    uploadVideo,
    getUserVideos,
    togglePublishStatus,
    getAllVideos,
    getVideoById,
    deleteVideo,
    updateVideo,
    getWatchHistory,
    getLikedVideos,
    toggleVideoLike,
    removeFromWatchHistory,
    removeFromLikedVideos
}

export default videoService