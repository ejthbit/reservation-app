import { Booking } from '../types'
import getDateWithCorrectOffset from './getDateWithCorrectOffset'
import isNilOrEmpty from './isNilOrEmpty'

export type BookingEventResource = {
    birthdate: string
    blocked: boolean
    booked: boolean
    category?: number
    completed: boolean
    doctorService?: boolean
    email?: string
    name: string
    note?: string | null
    phone?: string
    selectedDoctorId?: string | null
    workplace: number
}

export type BookingEvent = {
    id?: number
    start: Date
    end: Date
    title?: string
    resource?: BookingEventResource
}
type BookingResource = Booking & { doctorService?: boolean }
const makeCalendarEventsFromBookings = (
    bookings: Partial<BookingResource>[],
    blocked = false,
): BookingEvent[] =>
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
            workplace = 0,
        }) => {
            return {
                id,
                start: getDateWithCorrectOffset(start!),
                end: getDateWithCorrectOffset(end!),
                title: `${blocked ? 'Zavřeno' : name}${!isNilOrEmpty(birthdate) ? ` - ${birthdate}` : ''}`,
                resource: {
                    name,
                    booked: true,
                    birthdate,
                    blocked,
                    doctorService,
                    phone: contact?.phone,
                    email: contact?.email,
                    selected_doctor_id,
                    category,
                    completed,
                    workplace,
                    note,
                },
            }
        },
    )

export default makeCalendarEventsFromBookings
