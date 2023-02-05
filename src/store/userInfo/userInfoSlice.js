import { createSlice } from '@reduxjs/toolkit'
import STATE_KEYS from '../../../constants/stateKeys'

const userInfoInitialState = {
    userName: null,
    userId: null,
    defaultWorkspace: null,
    userRole: 1,
    isLoggedIn: false,
}
const userInfoSlice = createSlice({
    name: STATE_KEYS.USER_INFO,
    initialState: userInfoInitialState,
    reducers: {
        setUserInfoProperty: (state, { payload }) => {
            const { property, value } = payload
            return { ...state, [property]: value }
        },
        setUser: (state, { payload }) => {
            state = { ...payload, isLoggedIn: true }
        },
        logOut: () => userInfoInitialState,
    },
})
export const { setUserInfoProperty, setUser, logOut } = userInfoSlice.actions
export default userInfoSlice.reducer
