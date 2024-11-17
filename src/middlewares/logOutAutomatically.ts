import { useUser } from '../context/User/UserProvider'
import { isNilOrEmpty } from '../utils'

import { Middleware, SWRHook } from 'swr'

const checkTokenExpirationMiddleware: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const { logOut, logOutAutomatically } = useUser()
    const storedUser = localStorage.getItem('user')
    const tokenExp = storedUser && JSON.parse(storedUser)['exp']

    if (!isNilOrEmpty(tokenExp) && tokenExp < Date.now()) {
        logOutAutomatically()
        setTimeout(() => {
            localStorage.clear()
            logOut()
        }, 30000)
    }

    const swr = useSWRNext(key, fetcher, config)

    return swr
}

export default checkTokenExpirationMiddleware
