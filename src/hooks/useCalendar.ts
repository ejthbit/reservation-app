import { addMinutes } from 'date-fns'
import { equals } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SlotInfo } from 'react-big-calendar'
import { useGetBookings, useUpdateBooking } from '../context/Administration/AdministrationBookingsHooks'
import { useAdministration } from '../context/Administration/AdministrationProvider'

import {
    getDateWithCorrectOffset,
    getISODateStringWithCorrectOffset,
    makeCalendarEventsFromBookings,
} from '../utils'
import { BookingEvent } from '../utils/makeCalendarEventsFromBookings'
import { useDoctorServices } from './useDoctorServices'
import { useReservation } from '../context/Reservation'
import { DoctorService } from '../types/AmbulanceService'
type Intervals = {
    start: string
    end: string
}[]

type DoctorsIdsWithNames = {
    [key: string]: string
}

const hourlyIntervals = (arr: DoctorService[]): Intervals[] =>
    arr.map((obj) => {
        const start = getDateWithCorrectOffset(obj.start)
        const end = getDateWithCorrectOffset(obj.end)

        const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
        const intervalCount = diffInMinutes / 30 // Number of 30-minute intervals

        const intervals: Intervals = []
        for (let i = 0; i < intervalCount; i++) {
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
const flattenedIntervals = (arr: DoctorService[]): Intervals =>
    arr.reduce<Intervals>((acc, obj) => acc.concat(...hourlyIntervals([obj])), [])

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
const removeContainedEntries = (array1: Intervals, array2: Intervals) => {
    return array1.filter((entry1) => {
        return !array2.some((entry2) => {
            return entry1.start >= entry2.start && entry1.end <= entry2.end
        })
    })
}

const useCalendar = () => {
    const [draggedEvent, setDraggedEvent] = useState<BookingEvent | null>(null)
    const [openEventDialogEvent, setOpenEventDialogEvent] = useState<BookingEvent | null>(null)
    const [newAppointmentDate, setNewAppointmentDate] = useState<{ start: string; end: string } | null>(null)
    const { selectedViewDateRange, selectedWorkspace } = useAdministration()
    const { from = '', to = '' } = selectedViewDateRange ?? {}

    const { trigger: updateBooking } = useUpdateBooking()
    const {
        trigger: getBookings,
        data: bookings = [],
        isMutating: isLoadingEventsForSelectedView,
    } = useGetBookings()

    const {
        api: { fetchDoctorServicesByRange },
        servicesDays = [],
        isLoadingServicesDays,
    } = useDoctorServices()

    const {
        api: { getDoctorsForSelectedAmbulance },
        doctorsForSelectedAmbulance,
    } = useReservation()

    const doctors: DoctorsIdsWithNames = useMemo(
        () =>
            doctorsForSelectedAmbulance?.data?.reduce<DoctorsIdsWithNames>(
                (obj, item) => {
                    obj[item.doctor_id] = item.name
                    return obj
                },
                {} as DoctorsIdsWithNames, // Ensure the accumulator is typed as DoctorsIdsWithNames
            ) || {}, // Provide a fallback value of empty object if data is undefined
        [doctorsForSelectedAmbulance],
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
    const handleToggleCreationModal = () => setNewAppointmentDate(null)

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

    //Fix me
    const dragFromOutsideItem = useCallback((draggedEvent: BookingEvent) => draggedEvent!, [draggedEvent])

    const moveEvent = ({
        event,
        start,
        end,
    }: {
        event: BookingEvent | null
        start: string | Date
        end: string | Date
    }) => {
        const { email, phone, category, birthdate, name, workplace } = event?.resource!
        updateBooking({
            id: event?.id!,
            start: typeof start === 'string' ? start : getISODateStringWithCorrectOffset(start),
            end: typeof end === 'string' ? end : getISODateStringWithCorrectOffset(end),
            contact: { email, phone },
            birthdate,
            category: category ?? 0,
            name,
            workplace,
        })
    }

    const onDropFromOutside = ({ start, end }: { start: string | Date; end: string | Date }) => {
        const event = draggedEvent?.id
            ? ({
                  id: draggedEvent.id,
                  start,
                  end,
              } as BookingEvent)
            : null

        setDraggedEvent(null)
        moveEvent({ event, start, end })
    }

    useEffect(() => {
        if (!from && !to) {
            getBookings({ from, to, workplace: selectedWorkspace })
            fetchDoctorServicesByRange({ start: from, end: to, workplace: parseInt(selectedWorkspace) })
        }
        getDoctorsForSelectedAmbulance && getDoctorsForSelectedAmbulance(parseInt(selectedWorkspace))
    }, [selectedViewDateRange, selectedWorkspace])

    return {
        openEventDialogEvent,
        newAppointmentDate,
        isLoadingEventsForSelectedView:
            isLoadingEventsForSelectedView && isLoadingServicesDays && doctorsForSelectedAmbulance?.isLoading,
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
