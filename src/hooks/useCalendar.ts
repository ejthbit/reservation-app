import { addMinutes } from 'date-fns'
import { equals } from 'ramda'
import { useEffect, useMemo, useState } from 'react'
import { SlotInfo } from 'react-big-calendar'
import { useGetBookings, useUpdateBooking } from '../context/Administration/AdministrationBookingsHooks'
import { useAdministration } from '../context/Administration/AdministrationProvider'
import {
    useGetDoctorsForSelectedAmbulanceQuery,
    useLazyGetDoctorServicesByRangeQuery,
} from '../store/reservationProcess'
import {
    getDateWithCorrectOffset,
    getISODateStringWithCorrectOffset,
    makeCalendarEventsFromBookings,
} from '../utils'
import { BookingEvent } from '../utils/makeCalendarEventsFromBookings'

const hourlyIntervals = (arr) =>
    arr.map((obj) => {
        const start = getDateWithCorrectOffset(obj.start)
        const end = getDateWithCorrectOffset(obj.end)

        const diffInMs = end - start
        const diffInHrs = diffInMs / (1000 * 30 * 60)

        const intervals = []
        for (let i = 0; i < diffInHrs; i++) {
            const intervalStart = getISODateStringWithCorrectOffset(
                new Date(start.getTime() + i * 30 * 60 * 1000),
            )
            const intervalEnd = getISODateStringWithCorrectOffset(
                new Date(start.getTime() + (i + 1) * 30 * 60 * 1000),
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

const generateHourlyIntervals = (startDate: string, endDate: string) => {
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
            end: getISODateStringWithCorrectOffset(new Date(currentDateTime.getTime() + 30 * 60 * 1000)),
        })

        currentDateTime = new Date(currentDateTime.getTime() + 30 * 60 * 1000)
    }

    return intervals
}

const useCalendar = () => {
    const [draggedEvent, setDraggedEvent] = useState<BookingEvent | null>(null)
    const [openEventDialogEvent, setOpenEventDialogEvent] = useState<BookingEvent | null>(null)
    const [newAppointmentDate, setNewAppointmentDate] = useState({})
    const { selectedViewDateRange, selectedWorkspace } = useAdministration()
    const { from = '', to = '' } = selectedViewDateRange ?? {}

    const { trigger: updateBooking } = useUpdateBooking()
    const {
        trigger: getBookings,
        data: bookings = [],
        isMutating: isLoadingEventsForSelectedView,
    } = useGetBookings()
    const [
        fetchDoctorServicesByRange,
        { currentData: servicesDays = [], isFetching: isLoadingServicesDays },
    ] = useLazyGetDoctorServicesByRangeQuery()

    const { data: doctorsForSelectedAmbulance = [], isFetching: isLoadingDoctorsForSelectedAmbulance } =
        useGetDoctorsForSelectedAmbulanceQuery(selectedWorkspace)

    const doctors = doctorsForSelectedAmbulance.reduce(
        (obj, item) => ((obj[item.value] = item.label), obj),
        {},
    )
    const events = useMemo(() => makeCalendarEventsFromBookings(bookings), [selectedViewDateRange, bookings])

    const blockedEvents = useMemo(() => {
        const timesToBlock = removeContainedEntries(
            generateHourlyIntervals(from?.slice(0, 10), to?.slice(0, 10)),
            flattenedIntervals(servicesDays),
        )
        return makeCalendarEventsFromBookings(timesToBlock, true)
    }, [selectedViewDateRange, servicesDays])

    const handleOpenEventDialog = (existingEvent: BookingEvent) =>
        !existingEvent?.resource?.blocked && setOpenEventDialogEvent(existingEvent)
    const handleToggleCreationModal = () => setNewAppointmentDate({})

    const onSelectEvent = (event: BookingEvent) => handleOpenEventDialog(event)

    const onSelectSlot = ({ action, slots }: SlotInfo) => {
        const timeSlotStart = slots[0]! // start date/time of the event
        if (equals(action, 'click'))
            setNewAppointmentDate({
                start: getISODateStringWithCorrectOffset(timeSlotStart),
                end: getISODateStringWithCorrectOffset(
                    addMinutes(timeSlotStart, import.meta.env.VITE_APPOINTMENT_DURATION),
                ),
            })
    }
    const handleDragStart = (event: BookingEvent) => setDraggedEvent(event)

    const dragFromOutsideItem = () => draggedEvent
    const moveEvent = ({ event, start, end }: { event: BookingEvent; start: Date; end: Date }) =>
        updateBooking({
            id: event.id,
            start: getISODateStringWithCorrectOffset(start),
            end: getISODateStringWithCorrectOffset(end),
        })

    const onDropFromOutside = ({ start, end }: { start: Date; end: Date }) => {
        const event = {
            id: draggedEvent?.id,
            start,
            end,
        }
        setDraggedEvent(null)
        moveEvent({ event, start, end })
    }

    useEffect(() => {
        if (!from && !to) {
            getBookings({ from, to, workplace: selectedWorkspace })
            fetchDoctorServicesByRange({ start: from, end: to, workplace: selectedWorkspace })
        }
    }, [selectedViewDateRange, selectedWorkspace])

    return {
        openEventDialogEvent,
        newAppointmentDate,
        isLoadingEventsForSelectedView:
            isLoadingEventsForSelectedView && isLoadingServicesDays && isLoadingDoctorsForSelectedAmbulance,
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
        doctors,
    }
}
export default useCalendar
