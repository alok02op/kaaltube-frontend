import conf from '../conf.js'
import axios from 'axios'

const api = axios.create({
    baseURL: conf.backend_url,
    withCredentials: true
});

const getImageUrl = async (public_id) => {
    try {
        const response = await api.post('/get-image-url', { public_id })
        return response.data
    } catch (error) {
        console.log('Cloud Service :: getImageUrl error : ', error.response?.data?.message || error.message);
        throw error
    }
}

const uploadOnCloudinary = async (file, type = 'image') => {
    if (!file) return '';

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset");
    formData.append("cloud_name", conf.cloud_name);

    try {
        const { data } = await api.post(
            `https://api.cloudinary.com/v1_1/${conf.cloud_name}/${type}/upload`,
            formData
        )
        return data.public_id;
    } catch (error) {
        throw error
    }
}

const cloudService = {
    getImageUrl,
    uploadOnCloudinary
}

export default cloudService;