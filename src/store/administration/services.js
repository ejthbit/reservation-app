import { createApi } from '@reduxjs/toolkit/query/react'
import STATE_KEYS from '../../../constants/stateKeys'
import axiosGynInstance from '../../api/config'

export const bookingsAPI = createApi({
    reducerPath: `${STATE_KEYS.ADMINISTRATION}/bookings`,
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        getBookings: builder.query({
            query: ({ from, to, workplace }) => {
                const URL = `bookings/getBookings/${from}/${to}`
                return {
                    url: workplace ? `${URL}/${workplace}` : URL,
                    method: 'GET',
                }
            },
            // async onQueryStarted(_, { dispatch, queryFulfilled }) {
            //     try {
            //         const { data } = await queryFulfilled
            //         localStorage.setItem('user', JSON.stringify(data))
            //         dispatch(setUser(data))
            //     } catch (err) {
            //         return console.error('There was an error while logIn as current user.')
            //     }
            // },
        }),
        updateBooking: builder.mutation({
            query: (updatedData) => ({
                url: `bookings/booking/${updatedData.id}`,
                method: 'PUT',
                data: updatedData,
            }),
        }),
    }),
})
export const { useLazyGetBookingsQuery, useUpdateBookingMutation } = bookingsAPI
