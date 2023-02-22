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
            // providesTags: ['Booking'],
            providesTags: (result, error, arg) =>
                result ? [...result.map(({ id }) => ({ type: 'Booking', id })), 'Booking'] : ['Booking'],
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
        fastBooking: builder.mutation({
            query: ({ name, start, end, category, contact = null, note = null, workplace }) => ({
                url: `bookings/booking`,
                method: 'POST',
                data: {
                    name,
                    birthDate: new Date().toISOString().slice(0, 10),
                    start,
                    end,
                    workplace,
                    contact,
                    category,
                    ...(note && { note }),
                },
            }),
            invalidatesTags: ['Booking'],
        }),
        updateBooking: builder.mutation({
            query: (updatedData) => ({
                url: `bookings/booking/${updatedData.id}`,
                method: 'PUT',
                data: updatedData,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Booking', id: arg.originalArgs }],
        }),
        deleteBooking: builder.mutation({
            query: (bookingId) => ({
                url: `bookings/booking/${bookingId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Booking', id: arg.originalArgs }],
        }),
    }),
})

export const {
    useGetBookingsQuery,
    useLazyGetBookingsQuery,
    useUpdateBookingMutation,
    useDeleteBookingMutation,
    useFastBookingMutation,
} = bookingsAPI
