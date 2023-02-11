import { createSlice } from '@reduxjs/toolkit'
import STATE_KEYS from '../../../constants/stateKeys'

const notLoggedInUser = {
    userRole: 0,
    isLoggedIn: false,
    id: null,
    email: null,
    name: null,
    default_workplace: null,
}

const userInfoInitialState = {
    userRole: JSON.parse(localStorage.getItem('user'))?.user_role ?? 0,
    isLoggedIn: JSON.parse(localStorage.getItem('user'))?.success ?? false,
    automaticallyLoggedOut: false,
    id: JSON.parse(localStorage.getItem('user'))?.user?.id ?? null,
    email: JSON.parse(localStorage.getItem('user'))?.user?.email ?? null,
    name: JSON.parse(localStorage.getItem('user'))?.user?.name ?? null,
    default_workplace: JSON.parse(localStorage.getItem('user'))?.user?.default_workplace ?? null,
}
const userInfoSlice = createSlice({
    name: STATE_KEYS.USER_INFO,
    initialState: userInfoInitialState,
    reducers: {
        setUserInfoProperty: (state, { payload }) => {
            const { property, value } = payload
            return { ...state, [property]: value }
        },
        setUser: (state, { payload }) => (state = { ...payload.user, isLoggedIn: true }),
        logOut: () => notLoggedInUser,
    },
})
export const { setUserInfoProperty, setUser, logOut } = userInfoSlice.actions
export default userInfoSlice.reducer
