import { map } from 'ramda'
import getDateWithCorrectOffset from './getDateWithCorrectOffset'
import isNilOrEmpty from './isNilOrEmpty'

const makeCalendarEventsFromBookings = (bookings) =>
    map(({ id, name, start, end, birthdate, contact, category, completed }) => {
        return {
            id,
            start: getDateWithCorrectOffset(start),
            end: getDateWithCorrectOffset(end),
            title: `${name} ${!isNilOrEmpty(birthdate) ? `- ${birthdate}` : ''}`,
            resource: {
                booked: true,
                phone: contact?.phone,
                category,
                completed,
            },
        }
    }, bookings)

export default makeCalendarEventsFromBookings
