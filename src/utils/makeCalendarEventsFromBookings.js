import { map } from 'ramda'
import getDateWithCorrectOffset from './getDateWithCorrectOffset'
import isNilOrEmpty from './isNilOrEmpty'

const makeCalendarEventsFromBookings = (bookings, blocked = false) =>
    map(
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
        }) => {
            return {
                id,
                start: getDateWithCorrectOffset(start),
                end: getDateWithCorrectOffset(end),
                title: `${blocked ? 'Zavřeno' : name} ${!isNilOrEmpty(birthdate) ? `- ${birthdate}` : ''}`,
                resource: {
                    booked: true,
                    blocked,
                    phone: contact?.phone,
                    category,
                    completed,
                    note,
                },
            }
        },
        bookings
    )

export default makeCalendarEventsFromBookings
