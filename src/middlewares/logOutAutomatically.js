import { isNilOrEmpty } from '../utils'

import { logOut, logOutAutomatically } from '../store/userInfo/userInfoSlice'

const checkTokenExpirationMiddleware =
    ({ dispatch }) =>
    (next) =>
    (action) => {
        const tokenExp =
            JSON.parse(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user'))['exp']

        if (
            !isNilOrEmpty(tokenExp) &&
            tokenExp < Date.now() &&
            action.type === 'reservationProcess/ambulances/internalSubscriptions/subscriptionsUpdated'
        ) {
            dispatch(logOutAutomatically())
            setTimeout(() => {
                localStorage.clear()
                dispatch(logOut())
            }, 60000)
        }
        return next(action)
    }
export default checkTokenExpirationMiddleware
