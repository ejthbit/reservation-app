import { createSlice } from '@reduxjs/toolkit'
import STATE_KEYS from '../../../constants/stateKeys'

const userInfoInitialState = {
    userRole: 1,
    isLoggedIn: JSON.parse(localStorage.getItem('user'))?.success ?? false,
    automaticallyLoggedOut: false,
    userName: JSON.parse(localStorage.getItem('user'))?.user?.name ?? null,
    defaultWorkspace: JSON.parse(localStorage.getItem('user'))?.user?.default_workplace ?? null,
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
        logOut: () => userInfoInitialState,
    },
})
export const { setUserInfoProperty, setUser, logOut } = userInfoSlice.actions
export default userInfoSlice.reducer
