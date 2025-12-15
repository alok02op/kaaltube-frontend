import axios from 'axios'
import conf from '../conf.js'

const api = axios.create({
    baseURL: conf.backend_url,
    withCredentials: true
});

const getVideoComments = async (videoId) => {
    try {
        const response = await api.get('/api/v1/comments', { params: {videoId} })
        return response.data.data
    } catch (error) {
        console.log('Comment Service :: getVideoComments error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const addComment = async (comment) => {
    try {
        const response = await api.post('/api/v1/comments/add-comment', {...comment})
        return response.data.data
    } catch (error) {
        console.log('Comment Service :: addComment error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const updateComment = async (commentId, newContent) => {
    try {
        const response = await api.patch(`/api/v1/comments/${commentId}`, {newContent})
        return response.data.data
    } catch (error) {
        console.log('Comment Service :: updateComment error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const deleteComment = async (commentId) => {
    try {
        await api.delete(`/api/v1/comments/${commentId}`)
    } catch (error) {
        console.log('Comment Service :: deleteComment error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const toggleCommentLike = async (commentId) => {
    try {
        const response = await api.patch('/api/v1/comments/like', {commentId})
        return response.data.data
    } catch (error) {
        console.log('Comment Service :: toggleLikeComment error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const commentService = {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
    toggleCommentLike
}

export default commentService