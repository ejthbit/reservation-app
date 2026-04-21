import { Middleware, SWRHook } from 'swr'
import { useUser } from '../context/User/UserProvider'

const getTokenExp = (): number | undefined => {
    try {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored)['exp'] : undefined
    } catch {
        return undefined
    }
}

let logoutScheduled = false

const checkTokenExpirationMiddleware: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const { logOut, logOutAutomatically } = useUser()
    const exp = getTokenExp()
    const isExpired = exp !== undefined && exp < Date.now()

    if (isExpired && !logoutScheduled) {
        logoutScheduled = true
        localStorage.removeItem('user')
        logOutAutomatically()
        setTimeout(() => {
            logOut()
            logoutScheduled = false
        }, 30000)
    }

    return useSWRNext(key, isExpired ? null : fetcher, config)
}

export default checkTokenExpirationMiddleware
