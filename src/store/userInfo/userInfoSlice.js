import { createSlice } from '@reduxjs/toolkit'

export const STATE_KEY = 'userInfo'
const userInfoInitialState = {
    userName: null,
    userId: null,
    defaultWorkspace: null,
    userRole: 1,
    isLoggedIn: false,
}
const userInfoSlice = createSlice({
    name: 'userInfo',
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
