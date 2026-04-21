import { addMinutes, startOfDay } from 'date-fns'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SlotInfo } from 'react-big-calendar'
import { useGetBookings, useUpdateBooking } from '../context/Administration/AdministrationBookingsHooks'
import { useAdministration } from '../context/Administration/AdministrationProvider'
import { useSnackbar } from 'notistack'

import {
    getDateWithCorrectOffset,
    getISODateStringWithCorrectOffset,
    makeCalendarEventsFromBookings,
} from '../utils'
import { BookingEvent } from '../utils/makeCalendarEventsFromBookings'
import { useDoctorServices } from './useDoctorServices'
import { getDoctorsForSelectedAmbulanceFetcher } from '../context/Reservation/ReservationFetchers'
import { fetchVacations } from '../context/Administration/AdministrationVacationFetchers'
import { DoctorService } from '../types/AmbulanceService'
import { Doctor } from '../types/Doctor'
import { Vacation } from '../types'
import useSWRMutation from 'swr/mutation'
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
    const { enqueueSnackbar } = useSnackbar()
    const [draggedEvent, setDraggedEvent] = useState<BookingEvent | null>(null)
    const [openEventDialogEvent, setOpenEventDialogEvent] = useState<BookingEvent | null>(null)
    const [newAppointmentDate, setNewAppointmentDate] = useState<{ start: string; end: string } | null>(null)
    const [openFastBooking, setOpenFastBooking] = useState(false)
    const { selectedViewDateRange, selectedWorkspace } = useAdministration()
    const { from = '', to = '' } = selectedViewDateRange ?? {}

    const { trigger: updateBooking } = useUpdateBooking()
    const {
        trigger: getBookings,
        data: bookings = [],
        isMutating: isLoadingEventsForSelectedView,
    } = useGetBookings()

    // useSWR('bookings', () => getBookings({ from, to, workplace: selectedWorkspace }))
    const {
        api: { fetchDoctorServicesByRange },
        servicesDays = [],
        isLoadingServicesDays,
    } = useDoctorServices()

    const {
        data: doctorsData,
        trigger: getDoctorsForSelectedAmbulance,
        isMutating: isLoadingDoctors,
    } = useSWRMutation<Doctor[], Error, string, number>('calendar/getDoctors', (key, { arg }) =>
        getDoctorsForSelectedAmbulanceFetcher(arg),
    )

    const {
        data: vacationsData,
        trigger: getVacations,
    } = useSWRMutation<Vacation[], Error, string, { from: string; to: string; workplace: string }>(
        'calendar/getVacations',
        (key, { arg }) => fetchVacations(arg),
    )

    const doctors: DoctorsIdsWithNames = useMemo(
        () =>
            doctorsData?.reduce<DoctorsIdsWithNames>((obj, item) => {
                obj[item.doctor_id] = item.name
                return obj
            }, {}) || {},
        [doctorsData],
    )

    const events = useMemo(() => makeCalendarEventsFromBookings(bookings), [bookings])

    const blockedEvents = useMemo(() => {
        const timesToBlock = removeContainedEntries(
            generateHourlyIntervals(from?.slice(0, 10), to?.slice(0, 10)),
            flattenedIntervals(servicesDays),
        )
        return makeCalendarEventsFromBookings(timesToBlock, true)
    }, [from, to, servicesDays])

    const vacationEvents: BookingEvent[] = useMemo(() => {
        if (!vacationsData?.length) return []
        return vacationsData.flatMap((vacation) => {
            const start = new Date(vacation.start)
            const end = new Date(vacation.end)
            const events: BookingEvent[] = []
            const current = startOfDay(start)
            const endDay = startOfDay(end)
            while (current <= endDay) {
                events.push({
                    start: new Date(current.getFullYear(), current.getMonth(), current.getDate(), 7, 0),
                    end: new Date(current.getFullYear(), current.getMonth(), current.getDate(), 19, 0),
                    title: vacation.note ? `Dovolená — ${vacation.note}` : 'Dovolená',
                    resource: {
                        name: 'Dovolená',
                        booked: false,
                        birthdate: '',
                        blocked: false,
                        completed: false,
                        vacation: true,
                        workplace: vacation.workplace,
                    },
                })
                current.setDate(current.getDate() + 1)
            }
            return events
        })
    }, [vacationsData])

    const handleOpenEventDialog = (existingEvent: BookingEvent) =>
        !existingEvent?.resource?.blocked && !existingEvent?.resource?.vacation && setOpenEventDialogEvent(existingEvent)
    const handleCloseEventDialog = () => setOpenEventDialogEvent(null)
    const handleToggleCreationModal = () => setNewAppointmentDate(null)

    const onSelectEvent = (event: BookingEvent) => handleOpenEventDialog(event)

    const isVacationDay = (date: Date) =>
        vacationEvents.some((v) => date >= v.start && date < v.end)

    const onSelectSlot = ({ action, slots }: SlotInfo) => {
        const timeSlotStart = slots[0]! // start date/time of the event
        if (action === 'click' && !isVacationDay(timeSlotStart))
            setNewAppointmentDate({
                start: getISODateStringWithCorrectOffset(timeSlotStart),
                end: getISODateStringWithCorrectOffset(
                    addMinutes(timeSlotStart, import.meta.env.VITE_APPOINTMENT_DURATION),
                ),
            })
    }
    const handleDragStart = (event: BookingEvent) => setDraggedEvent(event)

    const dragFromOutsideItem = useCallback(() => draggedEvent, [draggedEvent])

    const moveEvent = ({
        event,
        start,
        end,
    }: {
        event: BookingEvent | null
        start: string | Date
        end: string | Date
    }) => {
        if (!event?.resource) return

        const { email, phone, category, birthdate, name, workplace, completed } = event.resource
        updateBooking({
            id: event.id!,
            start: typeof start === 'string' ? start : getISODateStringWithCorrectOffset(start),
            end: typeof end === 'string' ? end : getISODateStringWithCorrectOffset(end),
            contact: { email, phone },
            birthdate,
            category: category ?? 0,
            name,
            workplace,
        }).then((payload) => {
            if (payload) {
                if (from && to) getBookings({ from, to, workplace: selectedWorkspace })
            }
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
        if (from && to) {
            getBookings({ from, to, workplace: selectedWorkspace }).catch(() =>
                enqueueSnackbar('Nepodařilo se načíst rezervace.', { variant: 'error' }),
            )
            fetchDoctorServicesByRange({ start: from, end: to, workplace: parseInt(selectedWorkspace) })
            getVacations({ from, to, workplace: selectedWorkspace }).catch(() =>
                enqueueSnackbar('Nepodařilo se načíst dovolené.', { variant: 'error' }),
            )
        }
    }, [selectedWorkspace, from, to])

    useEffect(() => {
        getDoctorsForSelectedAmbulance(parseInt(selectedWorkspace)).catch(() =>
            enqueueSnackbar('Nepodařilo se načíst lékaře.', { variant: 'error' }),
        )
    }, [selectedWorkspace])

    const filteredBlockedEvents = useMemo(
        () => blockedEvents.filter((e) => !isVacationDay(e.start)),
        [blockedEvents, vacationEvents],
    )

    const allEvents = useMemo(
        () => [...events, ...filteredBlockedEvents, ...vacationEvents],
        [events, filteredBlockedEvents, vacationEvents],
    )

    return {
        openEventDialogEvent,
        newAppointmentDate,
        isLoadingEventsForSelectedView:
            isLoadingEventsForSelectedView || isLoadingServicesDays || isLoadingDoctors,
        events: allEvents,
        draggedEvent,
        moveEvent,
        handleDragStart,
        dragFromOutsideItem,
        onSelectEvent,
        onDropFromOutside,
        onSelectSlot,
        handleOpenEventDialog,
        handleCloseEventDialog,
        handleToggleCreationModal,
        refetchBookings: () => {
            if (from && to) getBookings({ from, to, workplace: selectedWorkspace })
        },
        openFastBooking,
        handleOpenFastBooking: () => setOpenFastBooking(true),
        handleCloseFastBooking: () => setOpenFastBooking(false),
        doctors,
        servicesDays,
    }
}
export default useCalendar
