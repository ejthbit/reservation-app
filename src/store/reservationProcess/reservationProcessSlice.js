/* eslint-disable camelcase */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { forEach, isNil } from 'ramda'
import axiosGynInstance from '../../api/config'
import { getISODateStringWithCorrectOffset } from '../../utils'

/* RTK uses on background Immer library.
This means you can write code that "mutates" the state inside the reducer,
and Immer will safely return a correct immutably updated result. */
export const fetchAvailableTimeSlots = createAsyncThunk(
    'bookings/fetchAvailableTimeSlots',
    async ({ from, to, workplace }) => {
        const URL = `bookings/getAvailableSlots/${from}/${to}/${workplace}`
        const res = await axiosGynInstance.get(URL)
        return res.data
    }
)
export const fetchAvailableTimeSlotsDoctors = createAsyncThunk(
    'bookings/fetchAvailableTimeSlotsDoctors',
    async ({ from, to, workplace }) => {
        const URL = `bookings/getAvailableSlots/${from}/${to}/${workplace}`
        const res = await axiosGynInstance.get(URL)
        return res.data
    }
)
export const fetchAvailableTimeSlotsForDoctors =
    (servingDoctorsForDay, selectedAmbulanceId) => (dispatch) =>
        forEach(
            ({ start, end }) =>
                dispatch(
                    fetchAvailableTimeSlotsDoctors({
                        from: start,
                        to: end,
                        workplace: selectedAmbulanceId,
                    })
                ),
            servingDoctorsForDay
        )

const reservationProcessInitialState = {
    selectedAmbulance: null,
    preferredDoctor: '',
    selectedDate: getISODateStringWithCorrectOffset(new Date()).slice(0, 10),
    selectedTime: '',
    selectedCategory: '',
    activeStep: 'FIRST',
    availableTimeSlots: {
        isLoading: false,
        errors: undefined,
        slots: [],
    },
    contactInformation: {
        name: '',
        email: null,
        phone: '',
        birthDate: null,
    },
    isReservationBtnDisabled: false,
    lastBooking: {
        isLoading: false,
        errors: undefined /* 'stringos', */,
        completed: false,
        data: {},
    },
}
const reservationProcessSlice = createSlice({
    name: 'reservationProcess',
    initialState: reservationProcessInitialState,
    reducers: {
        setActiveStep: (state, action) => {
            state.activeStep = action.payload
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
        setLastBookingInfo: (state) => {
            state.lastBooking.isLoading = false
            state.lastBooking.errors = undefined
            state.lastBooking.completed = true
        },
        clearReservation: (state) => (state = { ...state, ...reservationProcessInitialState }),
        clearTimeSlots: (state) => {
            state.availableTimeSlots.slots = []
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchAvailableTimeSlots.pending, (state) => {
                state.availableTimeSlots.isLoading = true
                state.availableTimeSlots.error = undefined
            })
            .addCase(fetchAvailableTimeSlots.fulfilled, (state, action) => {
                state.availableTimeSlots.isLoading = false
                state.availableTimeSlots.slots = action.payload
            })
            .addCase(fetchAvailableTimeSlots.rejected, (state, action) => {
                state.availableTimeSlots.isLoading = false
                state.availableTimeSlots.error = action.error
            })
            .addCase(fetchAvailableTimeSlotsDoctors.pending, (state) => {
                state.availableTimeSlots.isLoading = true
                state.availableTimeSlots.error = undefined
            })
            .addCase(fetchAvailableTimeSlotsDoctors.fulfilled, (state, action) => {
                state.availableTimeSlots.isLoading = false
                state.availableTimeSlots.slots = [
                    ...state.availableTimeSlots.slots,
                    ...action.payload,
                ]
            })
            .addCase(fetchAvailableTimeSlotsDoctors.rejected, (state, action) => {
                state.availableTimeSlots.isLoading = false
                state.availableTimeSlots.error = action.error
            }),
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
    clearTimeSlots,
    setReservationBtnDisabled,
    setLastBookingInfo,
} = reservationProcessSlice.actions
export default reservationProcessSlice.reducer
