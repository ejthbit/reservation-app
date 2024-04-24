import { createApi } from '@reduxjs/toolkit/query/react'
import STATE_KEYS from '../../../constants/stateKeys'
import axiosGynInstance from '../../api/config'
import { setUser } from './userInfoSlice'
import { setUserConfigurationProperty } from '../administration/administrationSlice'
export const userAPI = createApi({
    reducerPath: `${STATE_KEYS.USER_INFO}/user`,
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        signIn: builder.query({
            query: ({ email, password }) => ({
                url: `administration/signIn`,
                method: 'POST',
                data: { email, password },
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    localStorage.setItem('user', JSON.stringify(data))
                    dispatch(setUser(data))
                    dispatch(
                        setUserConfigurationProperty({
                            property: 'selectedAmbulance',
                            value: data?.user?.default_workplace,
                        }),
                    )
                } catch (err) {
                    console.error('There was an error while logIn as current user.')
                    throw err
                }
            },
        }),
        signUp: builder.mutation({
            query: ({ name, email, password }) => ({
                url: `administration/signUp`,
                method: 'POST',
                data: { name, email, password },
            }),
        }),
    }),
})
export const { useLazySignInQuery, useSignUpMutation } = userAPI
