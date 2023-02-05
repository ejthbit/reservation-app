import { path } from 'ramda'
import STATE_KEYS from '../../../constants/stateKeys'

export const getAuthInfo = path([STATE_KEYS.USER_INFO, 'isLoggedIn'])
export const getUserInfo = path([STATE_KEYS.RESERVATION_PROCESS])
