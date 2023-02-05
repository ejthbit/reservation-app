import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import reservationProcessReducer from './reservationProcess/reservationProcessSlice'
import userInfoReducer from './userInfo/userInfoSlice'
import {
    ambulancesAPI,
    bookingCategoriesAPI,
    contactMessageAPI,
    doctorServicesAPI,
    doctorsForSelectedAmbulanceAPI,
} from './reservationProcess/services'
import { userAPI } from './userInfo/services'
import STATE_KEYS from '../../constants/stateKeys'

const rootReducer = combineReducers({
    [STATE_KEYS.RESERVATION_PROCESS]: reservationProcessReducer,
    [STATE_KEYS.USER_INFO]: userInfoReducer,
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
