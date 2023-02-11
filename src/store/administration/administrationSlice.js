import { createSlice } from '@reduxjs/toolkit'
import STATE_KEYS from '../../../constants/stateKeys'

const administrationInitialState = {
    userConfiguration: {
        selectedAmbulance: null,
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

export const { setBookingsViewDate } = administrationSlice.actions
export default administrationSlice.reducer
