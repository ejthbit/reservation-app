import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import reservationProcessReducer from './reservationProcess/reservationProcessSlice'
import {
    ambulancesAPI,
    bookingCategoriesAPI,
    contactMessageAPI,
    doctorsForSelectedAmbulanceAPI,
} from './reservationProcess/services'

const rootReducer = combineReducers({
    reservationProcess: reservationProcessReducer,
    [ambulancesAPI.reducerPath]: ambulancesAPI.reducer,
    [bookingCategoriesAPI.reducerPath]: bookingCategoriesAPI.reducer,
    [contactMessageAPI.reducerPath]: contactMessageAPI.reducer,
    [doctorsForSelectedAmbulanceAPI.reducerPath]:
        doctorsForSelectedAmbulanceAPI.reducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        ambulancesAPI.middleware,
        bookingCategoriesAPI.middleware,
        contactMessageAPI.middleware,
        doctorsForSelectedAmbulanceAPI.middleware,
    ],
    devTools: process.env.NODE_ENV !== 'production',
})
