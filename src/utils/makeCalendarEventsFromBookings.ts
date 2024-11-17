import { Booking } from '../types'
import getDateWithCorrectOffset from './getDateWithCorrectOffset'
import isNilOrEmpty from './isNilOrEmpty'

export type BookingEvent = {
    id: number
    start: Date
    end: Date
    title: string
    resource: {
        booked: boolean
        blocked: boolean
        doctorService?: boolean
        phone?: string
        email?: string
        category?: number
        completed: boolean
        note?: string | null
        selectedDoctorId?: string | null
    }
}
type BookingResource = Booking & { doctorService?: boolean }
const makeCalendarEventsFromBookings = (bookings: BookingResource[], blocked = false): BookingEvent[] =>
    bookings.map(
        ({
            id,
            name = '',
            start,
            end,
            birthdate = '',
            contact = { phone: '', email: '' },
            category,
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
