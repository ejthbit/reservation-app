import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import reservationProcessReducer from './reservationProcess/reservationProcessSlice'
import userInfoReducer from './userInfo/userInfoSlice'
import administrationReducer from './administration/administrationSlice'
import { doctorServicesAPI, doctorsForSelectedAmbulanceAPI } from './reservationProcess/services'
import { userAPI } from './userInfo/services'
import STATE_KEYS from '../../constants/stateKeys'
import { bookingsAPI, announcementAPI } from './administration/services'
import checkTokenExpirationMiddleware from '../middlewares/logOutAutomatically'

const rootReducer = combineReducers({
    [STATE_KEYS.RESERVATION_PROCESS]: reservationProcessReducer,
    [STATE_KEYS.USER_INFO]: userInfoReducer,
    [STATE_KEYS.ADMINISTRATION]: administrationReducer,
    [doctorsForSelectedAmbulanceAPI.reducerPath]: doctorsForSelectedAmbulanceAPI.reducer,
    [doctorServicesAPI.reducerPath]: doctorServicesAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [bookingsAPI.reducerPath]: bookingsAPI.reducer,
    [announcementAPI.reducerPath]: announcementAPI.reducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        doctorsForSelectedAmbulanceAPI.middleware,
        doctorServicesAPI.middleware,
        userAPI.middleware,
        bookingsAPI.middleware,
        announcementAPI.middleware,
        checkTokenExpirationMiddleware,
    ],
    devTools: typeof process !== 'undefined' && process.env.NODE_ENV !== 'production',
})
