import { path } from 'ramda'
import STATE_KEYS from '../../../constants/stateKeys'

export const getBookings = path([STATE_KEYS.ADMINISTRATION, 'bookings', 'bookings'])
export const getBookingsSelectedDate = path([STATE_KEYS.ADMINISTRATION, 'bookings', 'selectedDate'])
export const getUserConfigurationSelectedAmbulance = path([
    STATE_KEYS.ADMINISTRATION,
    'userConfiguration',
    'selectedAmbulance',
])
