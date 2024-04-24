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
        const user = localStorage.getItem('user')
        if (user) {
            config.headers = {
                Authorization: authHeader(),
                'Content-Type': 'application/json',
            } as AxiosRequestHeaders
        }
        return config
    },
    (error) => Promise.reject(error),
)

export default axiosGynInstance
