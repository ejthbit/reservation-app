import { createApi } from '@reduxjs/toolkit/query/react'
import axiosGynInstance from '../../api/config'
import { setUser } from './userInfoSlice'

export const userAPI = createApi({
    reducerPath: 'reservationProcess/contactMessage',
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        logIn: builder.query({
            query: ({ email, password }) => ({
                url: `administration/logIntoAdministration`,
                method: 'POST',
                data: { email, password },
            }),
            async onQueryStarted({ onGetUser }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    localStorage.setItem('user', JSON.stringify(data))
                    dispatch(setUser(data))
                    onGetUser()
                } catch (err) {
                    console.error('There was an error while logIn as current user.')
                }
            },
        }),
    }),
})
export const { useLazyLogInQuery, useLogInQuery } = userAPI
