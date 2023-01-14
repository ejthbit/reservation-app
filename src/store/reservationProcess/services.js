import { createApi } from '@reduxjs/toolkit/query'
import axiosGynInstance from '../../api/config'

const ID = 'configuration'

export const ambulancesAPI = createApi({
    reducerPath: 'reservationProcess/ambulancesAPI',
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        getAmbulances: builder.query({
            query: () => `${ID}/getAmbulances`,
        }),
    }),
})

export const bookingCategoriesAPI = createApi({
    reducerPath: 'reservationProcess/bookingCategoriesAPI',
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        getBookingCategories: builder.query({
            query: () => `${ID}/getBookingCategories`,
        }),
    }),
})

export const doctorsForSelectedAmbulanceAPI = createApi({
    reducerPath: 'reservationProcess/doctorsForSelectedAmbulanceAPI',
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        getDoctorsForSelectedAmbulance: builder.query({
            query: (ambulanceId) => `${ID}/getDoctors/${ambulanceId}`,
        }),
    }),
})

export const contactMessageAPI = createApi({
    reducerPath: 'reservationProcess/contactMessageAPI',
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        postContactMessage: builder.mutation({
            query: (data) => ({
                url: `${ID}/contactForm/sendMessage`,
                method: 'POST',
                data,
            }),
        }),
    }),
})

export const { useGetAmbulances } = ambulancesAPI
export const { useGetBookingCategories } = bookingCategoriesAPI
export const { useGetDoctorsForSelectedAmbulance } =
    doctorsForSelectedAmbulanceAPI
export const { usePostContactMessage } = contactMessageAPI
