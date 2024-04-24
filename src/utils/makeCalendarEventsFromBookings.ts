import { Booking } from 'src/types/Booking'
import getDateWithCorrectOffset from './getDateWithCorrectOffset'
import isNilOrEmpty from './isNilOrEmpty'

type BookingResource = Booking & { doctorService: boolean }
const makeCalendarEventsFromBookings = (bookings: BookingResource[], blocked = false) =>
    bookings.map(
        ({
            id = '',
            name = '',
            start,
            end,
            birthdate = '',
            contact = {},
            category = '',
            completed = false,
            note = '',
            doctorService = false,
            selected_doctor_id = '',
        }) => {
            return {
                id,
                start: getDateWithCorrectOffset(start),
                end: getDateWithCorrectOffset(end),
                title: `${blocked ? 'Zavřeno' : name}${!isNilOrEmpty(birthdate) ? ` - ${birthdate}` : ''}`,
                resource: {
                    booked: true,
                    blocked,
                    doctorService,
                    phone: contact?.phone,
                    email: contact?.email,
                    selected_doctor_id,
                    category,
                    completed,
                    note,
                },
            }
        },
    )

export default makeCalendarEventsFromBookings
