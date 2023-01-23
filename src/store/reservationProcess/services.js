import { createApi } from '@reduxjs/toolkit/query/react'
import axiosGynInstance from '../../api/config'
import { makeArrayOfLabelValue } from './selectors'

const ID = 'configuration'

export const ambulancesAPI = createApi({
    reducerPath: 'reservationProcess/ambulances',
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        getAmbulances: builder.query({
            query: () => `${ID}/getAmbulances`,
            transformResponse: (response) =>
                makeArrayOfLabelValue('name', 'workplace_id', response.data),
        }),
    }),
})

export const bookingCategoriesAPI = createApi({
    reducerPath: 'reservationProcess/bookingCategories',
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        getBookingCategories: builder.query({
            query: () => `${ID}/getBookingCategories`,
        }),
    }),
})

export const doctorsForSelectedAmbulanceAPI = createApi({
    reducerPath: 'reservationProcess/doctorsForSelectedAmbulance',
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        getDoctorsForSelectedAmbulance: builder.query({
            query: (ambulanceId) => `${ID}/getDoctors/${ambulanceId}`,
            transformResponse: (response) =>
                makeArrayOfLabelValue('name', 'doctor_id', response.data),
        }),
    }),
})

export const contactMessageAPI = createApi({
    reducerPath: 'reservationProcess/contactMessage',
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

export const { useGetAmbulancesQuery, useLazyGetAmbulancesQuery } =
    ambulancesAPI
export const { useGetBookingCategories } = bookingCategoriesAPI
export const {
    useGetDoctorsForSelectedAmbulanceQuery,
    useLazyGetDoctorsForSelectedAmbulanceQuery,
} = doctorsForSelectedAmbulanceAPI
export const { usePostContactMessage } = contactMessageAPI
