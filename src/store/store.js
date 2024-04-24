import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import STATE_KEYS from '../../constants/stateKeys'
import administrationReducer from './administration/administrationSlice'
import { announcementAPI, bookingsAPI } from './administration/services'
import { doctorServicesAPI, doctorsForSelectedAmbulanceAPI } from './reservationProcess/services'

const rootReducer = combineReducers({
    [STATE_KEYS.ADMINISTRATION]: administrationReducer,
    [doctorsForSelectedAmbulanceAPI.reducerPath]: doctorsForSelectedAmbulanceAPI.reducer,
    [doctorServicesAPI.reducerPath]: doctorServicesAPI.reducer,
    [bookingsAPI.reducerPath]: bookingsAPI.reducer,
    [announcementAPI.reducerPath]: announcementAPI.reducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        doctorsForSelectedAmbulanceAPI.middleware,
        doctorServicesAPI.middleware,
        bookingsAPI.middleware,
        announcementAPI.middleware,
    ],
    devTools: typeof process !== 'undefined' && process.env.NODE_ENV !== 'production',
})
