import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import reservationProcessReducer from './reservationProcess/reservationProcessSlice'
import {
    ambulancesAPI,
    bookingCategoriesAPI,
    contactMessageAPI,
    doctorServicesAPI,
    doctorsForSelectedAmbulanceAPI,
} from './reservationProcess/services'

const rootReducer = combineReducers({
    reservationProcess: reservationProcessReducer,
    [ambulancesAPI.reducerPath]: ambulancesAPI.reducer,
    [bookingCategoriesAPI.reducerPath]: bookingCategoriesAPI.reducer,
    [contactMessageAPI.reducerPath]: contactMessageAPI.reducer,
    [doctorsForSelectedAmbulanceAPI.reducerPath]: doctorsForSelectedAmbulanceAPI.reducer,
    [doctorServicesAPI.reducerPath]: doctorServicesAPI.reducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        ambulancesAPI.middleware,
        bookingCategoriesAPI.middleware,
        contactMessageAPI.middleware,
        doctorsForSelectedAmbulanceAPI.middleware,
        doctorServicesAPI.middleware,
    ],
    devTools: process.env.NODE_ENV !== 'production',
})
