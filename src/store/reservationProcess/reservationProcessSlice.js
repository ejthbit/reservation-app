/* eslint-disable camelcase */
import { createSlice } from '@reduxjs/toolkit'
import { isNil } from 'ramda'
import { getISODateStringWithCorrectOffset } from '../../utils'

/* RTK uses on background Immer library.
This means you can write code that "mutates" the state inside the reducer,
and Immer will safely return a correct immutably updated result. */

const reservationProcessInitialState = {
    selectedAmbulance: null,
    preferredDoctor: '',
    selectedDate: getISODateStringWithCorrectOffset(new Date()).slice(0, 10),
    selectedTime: '',
    selectedCategory: '',
    activeStep: 'COMPLETED',
    contactInformation: {
        name: '',
        email: null,
        phone: '',
        birthDate: null,
    },
    isReservationBtnDisabled: false,
    lastBooking: {
        isLoading: false,
        errors: undefined,
        completed: false,
        data: {},
    },
}
const reservationProcessSlice = createSlice({
    name: 'reservationProcess',
    initialState: reservationProcessInitialState,
    reducers: {
        setActiveStep: (state, action) => {
            state.activeStep += action.payload
        },
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload.slice(0, 10)
        },
        setPreferredDoctor: (state, action) => {
            state.preferredDoctor = action.payload
        },
        setSelectedTime: (state, action) => {
            state.selectedTime = action.payload
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
        },
        setSelectedAmbulance: (state, action) => {
            state.selectedAmbulance = action.payload
        },
        setContactInformation: (state, action) => {
            const { name, email, phone, birthDate } = action.payload
            state.contactInformation = {
                name,
                email,
                phone,
                birthDate: !isNil(birthDate)
                    ? birthDate.slice(0, 10)
                    : state.contactInformation.birthDate,
            }
        },
        setReservationBtnDisabled: (state, action) => {
            state.isReservationBtnDisabled = action.payload
        },
        clearReservation: (state) =>
            (state = { ...state, ...reservationProcessInitialState }),
    },
})

export const {
    setActiveStep,
    setSelectedDate,
    setPreferredDoctor,
    setSelectedAmbulance,
    setSelectedTime,
    setSelectedCategory,
    setContactInformation,
    setOrderFinishedOk,
    clearReservation,
    setReservationBtnDisabled,
} = reservationProcessSlice.actions
export default reservationProcessSlice.reducer
