import { useUser } from '../context/User/UserProvider'
import { isNilOrEmpty } from '../utils'

import { Middleware, SWRHook } from 'swr'

const checkTokenExpirationMiddleware: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const { logOut, logOutAutomatically } = useUser()
    const storedUser = localStorage.getItem('user')
    let tokenExp: number | undefined
    try {
        tokenExp = storedUser ? JSON.parse(storedUser)['exp'] : undefined
    } catch {
        localStorage.removeItem('user')
    }

    if (!isNilOrEmpty(tokenExp) && tokenExp! * 1000 < Date.now()) {
        localStorage.removeItem('user')
        logOutAutomatically()
        setTimeout(() => logOut(), 30000)
        return useSWRNext(key, null, config)
    }

    return useSWRNext(key, fetcher, config)
}

export default checkTokenExpirationMiddleware
