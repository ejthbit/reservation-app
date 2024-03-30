import { createApi } from '@reduxjs/toolkit/query/react'
import axiosGynInstance from '../../api/config'
import { makeArrayOfLabelValue } from './selectors'

const ID = 'configuration'

export const doctorsForSelectedAmbulanceAPI = createApi({
    reducerPath: 'reservationProcess/doctorsForSelectedAmbulance',
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        getDoctorsForSelectedAmbulance: builder.query({
            query: (ambulanceId) => `${ID}/getDoctors/${ambulanceId}`,
            transformResponse: (response) => makeArrayOfLabelValue('name', 'doctor_id', response.data),
        }),
    }),
})

export const doctorServicesAPI = createApi({
    reducerPath: 'reservationProcess/fetchDoctorServicesForSelectedMonth',
    baseQuery: axiosGynInstance,
    endpoints: (builder) => ({
        getDoctorServicesForMonth: builder.query({
            query: ({ month, workplace }) => ({
                url: `/bookings/getDoctorServicesForMonth/${month}/${workplace}`,
                method: 'GET',
            }),
        }),
        getDoctorServicesByRange: builder.query({
            query: ({ start, end, workplace }) => ({
                url: `/bookings/getDoctorServicesByRange/${start}/${end}/${workplace}`,
                method: 'GET',
            }),
        }),
        createServiceForMonth: builder.mutation({
            query: (data) => ({
                url: `/administration/doctorService`,
                method: 'POST',
                data,
            }),
        }),
        updateServiceForMonth: builder.mutation({
            query: ({ month, workplace, days }) => ({
                url: `/administration/doctorService/${month}/${workplace}`,
                method: 'PUT',
                data: { days },
            }),
        }),
    }),
})

export const { useGetDoctorsForSelectedAmbulanceQuery, useLazyGetDoctorsForSelectedAmbulanceQuery } =
    doctorsForSelectedAmbulanceAPI
export const {
    useGetDoctorServicesForMonthQuery,
    useLazyGetDoctorServicesForMonthQuery,
    useCreateServiceForMonthMutation,
    useUpdateServiceForMonthMutation,
    useGetDoctorServicesByRangeQuery,
    useLazyGetDoctorServicesByRangeQuery,
} = doctorServicesAPI
