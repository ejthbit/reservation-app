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

    if (!isNilOrEmpty(tokenExp) && tokenExp! < Date.now()) {
        logOutAutomatically()
        setTimeout(() => {
            localStorage.removeItem('user')
            logOut()
        }, 30000)
    }

    const swr = useSWRNext(key, fetcher, config)

    return swr
}

export default checkTokenExpirationMiddleware
