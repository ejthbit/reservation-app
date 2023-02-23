import { addMinutes } from 'date-fns'
import { equals } from 'ramda'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { getBookingsSelectedDate, getUserConfigurationSelectedAmbulance } from '../store/administration'
import { useLazyGetBookingsQuery, useUpdateBookingMutation } from '../store/administration/services'
import {
    useGetDoctorsForSelectedAmbulanceQuery,
    useLazyGetDoctorServicesByRangeQuery,
} from '../store/reservationProcess'
import {
    getDateWithCorrectOffset,
    getISODateStringWithCorrectOffset,
    isNilOrEmpty,
    makeCalendarEventsFromBookings,
} from '../utils'

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

const flattenedIntervals = (arr) => [].concat(...hourlyIntervals(arr))

const removeContainedEntries = (array1, array2) => {
    return array1.filter((entry1) => {
        return !array2.some((entry2) => {
            return entry1.start >= entry2.start && entry1.end <= entry2.end
        })
    })
}

const generateHourlyIntervals = (startDate, endDate) => {
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

    const { data: doctorsForSelectedAmbulance = [] } =
        useGetDoctorsForSelectedAmbulanceQuery(selectedAmbulanceId)

    const doctors = doctorsForSelectedAmbulance.reduce(
        (obj, item) => ((obj[item.value] = item.label), obj),
        {}
    )
    const doctorServicesEvents = useMemo(
        () =>
            makeCalendarEventsFromBookings(
                servicesDays.map((item) => ({ ...item, doctorService: true, name: doctors[item.doctorId] }))
            ),
        [bookingsViewDate, servicesDays]
    )
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
        events: [...events, ...blockedEvents, ...doctorServicesEvents],
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
