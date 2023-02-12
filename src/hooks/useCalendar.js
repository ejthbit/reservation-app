import { addMinutes } from 'date-fns'
import { equals } from 'ramda'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { getBookingsSelectedDate, getUserConfigurationSelectedAmbulance } from '../store/administration'
import { useLazyGetBookingsQuery, useUpdateBookingMutation } from '../store/administration/services'
import { getISODateStringWithCorrectOffset, isNilOrEmpty, makeCalendarEventsFromBookings } from '../utils'
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

    //TODO: Replace mockBookings => bookings REAL DATA
    const events = useMemo(() => makeCalendarEventsFromBookings(bookings), [bookingsViewDate, bookings])
    const handleOpenEventDialog = (existingEvent) => setOpenEventDialogEvent(existingEvent)
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
        if (!isNilOrEmpty(from) && !isNilOrEmpty(to))
            getBookings({ from, to, workplace: selectedAmbulanceId })
    }, [bookingsViewDate, selectedAmbulanceId])

    return {
        openEventDialogEvent,
        newAppointmentDate,
        isLoadingEventsForSelectedView,
        events,
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
