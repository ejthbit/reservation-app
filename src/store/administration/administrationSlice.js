import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import STATE_KEYS from '../../../constants/stateKeys'
import axiosGynInstance from '../../api/config'
import { getUserInfo } from '../userInfo'
import { getUserConfigurationSelectedAmbulance } from './selectors'

export const fastBooking = createAsyncThunk(
    'bookings/fastBooking',
    async ({ name, start, end, category, contact = null, note = null }, { getState, rejectWithValue }) => {
        const state = getState()
        const selectedAmbulanceId =
            getUserConfigurationSelectedAmbulance(state) ?? getUserInfo(state)?.default_workplace
        const URL = `bookings/booking`
        try {
            const res = await axiosGynInstance.post(URL, {
                name,
                birthDate: new Date().toISOString().slice(0, 10),
                start,
                end,
                workplace: selectedAmbulanceId,
                contact,
                category,
                ...(note && { note }),
            })
            return res.data
        } catch (error) {
            if (!error.response) throw error
            return rejectWithValue(error.response.data)
        }
    }
)

const administrationInitialState = {
    userConfiguration: {
        selectedAmbulance: JSON.parse(localStorage.getItem('user'))?.user?.default_workplace ?? null,
    },
    bookings: {
        selectedDate: {
            from: null,
            to: null,
        },
    },
}

const administrationSlice = createSlice({
    name: STATE_KEYS.ADMINISTRATION,
    initialState: administrationInitialState,
    reducers: {
        setBookingsViewDate: (state, action) => {
            state.bookings.selectedDate = action.payload
        },
        setUserConfigurationProperty: (state, { payload }) => {
            const { property, value } = payload
            return {
                ...state,
                userConfiguration: {
                    ...state.userConfiguration,
                    [property]: value,
                },
            }
        },
    },
})

export const { setBookingsViewDate, setUserConfigurationProperty } = administrationSlice.actions
export default administrationSlice.reducer
