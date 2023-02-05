import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import reservationProcessReducer, {
    STATE_KEY as RESERVATION_PROCESS_STATE_KEY,
} from './reservationProcess/reservationProcessSlice'
import userInfoReducer, { STATE_KEY as USER_INFO_STATE_KEY } from './userInfo/userInfoSlice'
import {
    ambulancesAPI,
    bookingCategoriesAPI,
    contactMessageAPI,
    doctorServicesAPI,
    doctorsForSelectedAmbulanceAPI,
} from './reservationProcess/services'
import { userAPI } from './userInfo/services'

const rootReducer = combineReducers({
    [RESERVATION_PROCESS_STATE_KEY]: reservationProcessReducer,
    [USER_INFO_STATE_KEY]: userInfoReducer,
    [ambulancesAPI.reducerPath]: ambulancesAPI.reducer,
    [bookingCategoriesAPI.reducerPath]: bookingCategoriesAPI.reducer,
    [contactMessageAPI.reducerPath]: contactMessageAPI.reducer,
    [doctorsForSelectedAmbulanceAPI.reducerPath]: doctorsForSelectedAmbulanceAPI.reducer,
    [doctorServicesAPI.reducerPath]: doctorServicesAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
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
        userAPI.middleware,
    ],
    devTools: process.env.NODE_ENV !== 'production',
})
