import { path } from 'ramda'
import { STATE_KEY } from './userInfoSlice'

export const getAuthInfo = path([STATE_KEY, 'isLoggedIn'])
export const getUserInfo = path([STATE_KEY])
