import axios, { AxiosRequestHeaders } from 'axios'
import authHeader from './authHeader'

const axiosGynInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        ...(authHeader() && { Authorization: authHeader() }),
    },
})

axiosGynInstance.interceptors.request.use(
    (config) => {
        const token = authHeader()
        if (token) {
            config.headers.set('Authorization', token)
        }
        config.headers.set('Content-Type', 'application/json')
        return config
    },
    (error) => Promise.reject(error),
)

axiosGynInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const sanitizedError = {
            message: error.response?.data?.message ?? error.message,
            status: error.response?.status,
            code: error.code,
        }
        return Promise.reject(sanitizedError)
    },
)

export default axiosGynInstance
