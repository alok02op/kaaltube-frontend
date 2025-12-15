import axios from 'axios'
import conf from '../conf.js'

const api = axios.create({
    baseURL: conf.backend_url,
    withCredentials: true
});

const search = async (query) => {
    try {
        const response = await api.get(`/api/v1/search?q=${encodeURIComponent(query)}`)
        return response.data.data
    } catch (error) {
        console.log('Search Service :: search error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const searchSuggestions = async (query) => {
    try {
        const response = await api.get(`/api/v1/search/suggestions?q=${encodeURIComponent(query)}`)
        return response.data.data
    } catch (error) {
        console.log('Search Service :: searchSuggestions error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const searchService = {
  search,
  searchSuggestions
}

export default searchService