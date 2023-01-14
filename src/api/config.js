import axios from 'axios'
import authHeader from './authHeader'

const axiosGynInstance = axios.create({
    baseURL: '/',
    // process.env.NODE_ENV !== 'production'
    //     ? process.env.API_URL
    //     : process.env.API_PROD_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        ...(authHeader() && { Authorization: authHeader() }),
    },
})

axiosGynInstance.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user')
        if (user)
            config.headers = {
                Authorization: authHeader(),
                'Content-Type': 'application/json',
            }
        return config
    },
    (error) => Promise.reject(error)
)

export default axiosGynInstance
