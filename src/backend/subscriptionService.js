import axios from 'axios'
import conf from '../conf.js'

const api = axios.create({
    baseURL: conf.backend_url,
    withCredentials: true
});

const getSubscribedChannels = async () => {
    try {
        const result = await api.get('/api/v1/subscriptions/subscribed-channel')
        return result.data.data
    } catch (error) {
        console.log('Subscription Service :: getSubscribedChannel error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const subscribeChannel = async (channelId) => {
    try {
        const result = await api.post('/api/v1/subscriptions/subscribe', { channelId })
        return result.data.data
    } catch (error) {
        console.log('Subscription Service :: subscribeChannel error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const unsubscribeChannel = async (channelId) => {
    try {
        await api.post('/api/v1/subscriptions/unsubscribe', { channelId })
    } catch (error) {
        console.log('Subscription Service :: unsubscribeChannel error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const getChannelProfile = async (channelId) => {
    try {
        const result = await api.get('/api/v1/subscriptions', { params: { channelId } })
        return result.data.data
    } catch (error) {
        console.log('Subscription Service :: getChannelProfile error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const getUserChannelProfile = async () => {
    try {
        const result = await api.get('/api/v1/subscriptions/user-channel')
        return result.data.data
    } catch (error) {
        console.log('Subscription Service :: getUserChannelProfile error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const subscriptionService = {
    getSubscribedChannels,
    subscribeChannel,
    unsubscribeChannel,
    getChannelProfile,
    getUserChannelProfile
}

export default subscriptionService