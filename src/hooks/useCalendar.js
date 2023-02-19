import { addMinutes } from 'date-fns'
import { equals } from 'ramda'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { getBookingsSelectedDate, getUserConfigurationSelectedAmbulance } from '../store/administration'
import { useLazyGetBookingsQuery, useUpdateBookingMutation } from '../store/administration/services'
import { useLazyGetDoctorServicesByRangeQuery } from '../store/reservationProcess'
import {
    getISODateStringWithCorrectOffset,
    isNilOrEmpty,
    makeCalendarEventsFromBookings,
    getDateWithCorrectOffset,
} from '../utils'
const mockBookings = [
    {
        id: 1,
        name: 'John Doe',
        start: '2023-02-13T07:00:00',
        end: '2023-02-13T07:10:00',
        birthdate: '01/01/1990',
        contact: {
            phone: '+1-555-555-5555',
            email: 'johndoe@example.com',
        },
        category: 2,
        completed: false,
    },
    {
        id: 2,
        name: 'Jane Doe',
        start: '2023-02-14T08:00:00',
        end: '2023-02-14T08:10:00',
        birthdate: '02/02/1991',
        contact: {
            phone: '+1-555-555-5556',
            email: 'janedoe@example.com',
        },
        category: 1,
        completed: true,
    },
    {
        id: 3,
        name: 'Jim Smith',
        start: '2023-02-15T09:00:00',
        end: '2023-02-15T09:10:00',
        birthdate: '03/03/1992',
        contact: {
            phone: '+1-555-555-5557',
            email: 'jimsmith@example.com',
        },
        category: 3,
        completed: false,
    },
    {
        id: 4,
        name: 'Jill Johnson',
        start: '2023-02-16T10:00:00',
        end: '2023-02-16T10:10:00',
        birthdate: '04/04/1993',
        contact: {
            phone: '+1-555-555-5558',
            email: 'jilljohnson@example.com',
        },
        category: 1,
        completed: true,
    },
    {
        id: 5,
        name: 'Tommy Lee',
        start: '2023-02-17T11:00:00',
        end: '2023-02-17T11:10:00',
        birthdate: '05/05/1994',
        contact: {
            phone: '+1-555-555-5559',
            email: 'tommylee@example.com',
        },
        category: 2,
        completed: false,
    },
    {
        id: 6,
        name: 'Emily Davis',
        start: '2023-02-13T12:00:00',
        end: '2023-02-13T12:10:00',
        birthdate: '06/06/1995',
        contact: {
            phone: '+1-555-555-5560',
            email: 'emilydavis@example.com',
        },
        category: 1,
        completed: false,
    },
]
const hourlyIntervals = (arr) =>
    arr.map((obj) => {
        const start = getDateWithCorrectOffset(obj.start)
        const end = getDateWithCorrectOffset(obj.end)

        const diffInMs = end - start
        const diffInHrs = diffInMs / (1000 * 60 * 60)

        const intervals = []
        for (let i = 0; i < diffInHrs; i++) {
            const intervalStart = getISODateStringWithCorrectOffset(
                new Date(start.getTime() + i * 60 * 60 * 1000)
            )
            const intervalEnd = getISODateStringWithCorrectOffset(
                new Date(start.getTime() + (i + 1) * 60 * 60 * 1000)
            )
            intervals.push({ start: intervalStart, end: intervalEnd })
        }

        return intervals
    })

//   // Flatten the array of arrays into a single array
const flattenedIntervals = (arr) => [].concat(...hourlyIntervals(arr))

const removeContainedEntries = (array1, array2) => {
    return array1.filter((entry1) => {
        return !array2.some((entry2) => {
            return entry1.start >= entry2.start && entry1.end <= entry2.end
        })
    })
}
function generateHourlyIntervals(startDate, endDate) {
    const startDateTime = new Date(startDate + 'T07:00:00')
    const endDateTime = new Date(endDate + 'T19:00:00')

    const intervals = []
    let currentDateTime = startDateTime

    while (currentDateTime < endDateTime) {
        if (currentDateTime.getHours() < 7) {
            currentDateTime.setHours(7)
            currentDateTime.setMinutes(0)
            currentDateTime.setSeconds(0)
            currentDateTime.setMilliseconds(0)
        }
        if (currentDateTime.getHours() >= 19) {
            currentDateTime.setDate(currentDateTime.getDate() + 1)
            currentDateTime.setHours(7)
            currentDateTime.setMinutes(0)
            currentDateTime.setSeconds(0)
            currentDateTime.setMilliseconds(0)
        }

        intervals.push({
            start: getISODateStringWithCorrectOffset(new Date(currentDateTime)),
            end: getISODateStringWithCorrectOffset(new Date(currentDateTime.getTime() + 60 * 60 * 1000)),
        })

        currentDateTime = new Date(currentDateTime.getTime() + 60 * 60 * 1000)
    }

    return intervals
}

const useCalendar = () => {
    const [draggedEvent, setDraggedEvent] = useState(null)
    const [openEventDialogEvent, setOpenEventDialogEvent] = useState(null)
    const [newAppointmentDate, setNewAppointmentDate] = useState({})

    const bookingsViewDate = useSelector(getBookingsSelectedDate)
    const { from, to } = bookingsViewDate
    const selectedAmbulanceId = useSelector(getUserConfigurationSelectedAmbulance)

    const [updateBooking] = useUpdateBookingMutation()
    const [getBookings, { data: bookings = [], isFetching: isLoadingEventsForSelectedView }] =
        useLazyGetBookingsQuery()
    const [fetchDoctorServicesByRange, { currentData: servicesDays = [] }] =
        useLazyGetDoctorServicesByRangeQuery()

    //TODO: Replace mockBookings => bookings REAL DATA
    const events = useMemo(() => makeCalendarEventsFromBookings(bookings), [bookingsViewDate, bookings])

    const blockedEvents = useMemo(() => {
        const timesToBlock = removeContainedEntries(
            generateHourlyIntervals(from?.slice(0, 10), to?.slice(0, 10)),
            flattenedIntervals(servicesDays)
        )
        return makeCalendarEventsFromBookings(timesToBlock, true)
    }, [bookingsViewDate, servicesDays])

    const handleOpenEventDialog = (existingEvent) =>
        !existingEvent?.resource?.blocked && setOpenEventDialogEvent(existingEvent)
    const handleToggleCreationModal = () => setNewAppointmentDate({})

    const onSelectEvent = (event) => handleOpenEventDialog(event)

    const onSelectSlot = ({ action, slots }) => {
        const timeSlotStart = slots[0] // start date/time of the event
        if (equals(action, 'click'))
            setNewAppointmentDate({
                start: getISODateStringWithCorrectOffset(timeSlotStart),
                end: getISODateStringWithCorrectOffset(
                    addMinutes(timeSlotStart, import.meta.env.VITE_APPOINTMENT_DURATION)
                ),
            })
    }
    const handleDragStart = (event) => setDraggedEvent(event)

    const dragFromOutsideItem = () => draggedEvent
    const moveEvent = ({ event, start, end }) =>
        updateBooking({
            id: event.id,
            start: getISODateStringWithCorrectOffset(start),
            end: getISODateStringWithCorrectOffset(end),
        })

    const onDropFromOutside = ({ start, end }) => {
        const event = {
            id: draggedEvent.id,
            start,
            end,
        }
        setDraggedEvent(null)
        moveEvent({ event, start, end })
    }

    useEffect(() => {
        if (!isNilOrEmpty(from) && !isNilOrEmpty(to)) {
            getBookings({ from, to, workplace: selectedAmbulanceId })
            fetchDoctorServicesByRange({ start: from, end: to, workplace: selectedAmbulanceId })
        }
    }, [bookingsViewDate, selectedAmbulanceId])

    return {
        openEventDialogEvent,
        newAppointmentDate,
        isLoadingEventsForSelectedView,
        events: [...events, ...blockedEvents],
        draggedEvent,
        moveEvent,
        handleDragStart,
        dragFromOutsideItem,
        onSelectEvent,
        onDropFromOutside,
        onSelectSlot,
        handleOpenEventDialog,
        handleToggleCreationModal,
    }
}
export default useCalendar
