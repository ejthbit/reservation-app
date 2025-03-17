import { format } from 'date-fns'
import { sortBy } from 'ramda'
import { PropsWithChildren, createContext, useState } from 'react'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset } from '../../utils'
import useSWRMutation from 'swr/mutation'
import { ReservationProcessData } from '../../components/Reservation/ReservationDialog/helpers/prepareReservationForCreation'
import { Booking } from '../../types'
import { Doctor } from '../../types/Doctor'
import {
    TimeSlotRequestData,
    createBookingFetcher,
    getAvailableTimeSlotsFetcher,
    getDoctorsForSelectedAmbulanceFetcher,
} from './ReservationFetchers'
import { BookingState, TimeSlot } from './types'

const reservationProcessInitialState: BookingState = {
    selectedAmbulance: null,
    preferredDoctor: '',
    selectedDate: getISODateStringWithCorrectOffset(new Date()).slice(0, 10),
    selectedTime: '',
    selectedCategory: '',
    activeStep: 'FIRST',
    availableTimeSlots: {
        isLoading: false,
        errors: undefined,
        slots: [],
    },
    contactInformation: {
        name: '',
        email: '',
        phone: '',
        birthdate: null,
    },
    isReservationBtnDisabled: false,
    lastBooking: {
        isLoading: false,
        errors: undefined /* 'stringos', */,
        completed: false,
        data: undefined,
    },
    doctorsForSelectedAmbulance: {
        errors: undefined,
        isLoading: false,
        data: undefined,
    },
    setters: {
        setActiveStep: () => {},
        setSelectedDate: () => {},
        setSelectedTime: () => {},
        setSelectedCategory: () => {},
        setSelectedAmbulance: () => {},
        setPreferredDoctor: () => {},
        setReservationBtnDisabled: () => {},
        setContactInfo: () => {},
    },
    api: {
        bookAnAppointment: () => {},
        clearDoctorsForSelectedAmbulance: () => {},
        clearTimeSlots: () => {},
        clearBooking: () => {},
        clearReservation: () => {},
    },
}

export const ReservationContext = createContext(reservationProcessInitialState)

export const ReservationProvider = ({ children }: PropsWithChildren) => {
    const {
        data: slots,
        trigger: fetchAvailableTimeSlots,
        error,
        isMutating,
        reset: clearTimeSlots,
    } = useSWRMutation<TimeSlot[], Error, string, TimeSlotRequestData>(
        'bookings/fetchAvailableTimeSlots',
        (key, { arg }) => getAvailableTimeSlotsFetcher(arg),
    )

    const [activeStep, setActiveStep] = useState(reservationProcessInitialState.activeStep)
    const {
        data: booking,
        trigger: bookAnAppointment,
        error: lastBookingError,
        reset: clearBooking,
        isMutating: isCreatingBooking,
    } = useSWRMutation<Booking, Error, string, ReservationProcessData>(
        'bookings/booking',
        (key, { arg }) => createBookingFetcher(arg),
        { onSuccess: () => setActiveStep('COMPLETED'), onError: () => setActiveStep('ERROR') },
    )

    const {
        data: doctorsForSelectedAmbulance,
        trigger: getDoctorsForSelectedAmbulance,
        error: doctorsForSelectedAmbulanceError,
        reset: clearDoctorsForSelectedAmbulance,
        isMutating: isLoadingDoctorsForSelectedAmbulance,
    } = useSWRMutation<Doctor[], Error, string, number>('bookings/booking', (key, { arg }) =>
        getDoctorsForSelectedAmbulanceFetcher(arg),
    )

    const [selectedDate, setSelectedDatee] = useState(reservationProcessInitialState.selectedDate)
    const [selectedTime, setSelectedTime] = useState(reservationProcessInitialState.selectedTime)
    const [selectedCategory, setSelectedCategory] = useState(reservationProcessInitialState.selectedCategory)
    const [selectedAmbulance, setSelectedAmbulance] = useState(
        reservationProcessInitialState.selectedAmbulance,
    )
    const [preferredDoctor, setPreferredDoctor] = useState(reservationProcessInitialState.preferredDoctor)
    const [contactInformation, setContactInformation] = useState(
        reservationProcessInitialState.contactInformation,
    )
    const [isReservationBtnDisabled, setReservationBtnDisabled] = useState(
        reservationProcessInitialState.isReservationBtnDisabled,
    )
    const setContactInfo = (payload: Record<string, string | null>) =>
        setContactInformation((prevState) => ({ ...prevState, ...payload }))
    const setSelectedDate = (date: Date) => setSelectedDatee(format(date, 'yyyy-MM-dd'))
    const clearReservation = () => {
        setActiveStep(reservationProcessInitialState.activeStep)
        setSelectedDate(getDateWithCorrectOffset(reservationProcessInitialState.selectedDate))
        setSelectedTime(reservationProcessInitialState.selectedTime)
        setSelectedCategory(reservationProcessInitialState.selectedCategory)
        setSelectedAmbulance(reservationProcessInitialState.selectedAmbulance)
        setPreferredDoctor(reservationProcessInitialState.preferredDoctor)
        setContactInfo({ ...reservationProcessInitialState.contactInformation })
        setReservationBtnDisabled(reservationProcessInitialState.isReservationBtnDisabled)
    }
    console.log({ isCreatingBooking, booking })
    const value: BookingState = {
        activeStep,
        selectedDate,
        selectedTime,
        selectedCategory,
        selectedAmbulance,
        preferredDoctor,
        contactInformation,
        isReservationBtnDisabled,
        availableTimeSlots: {
            slots: slots ? sortBy(({ timeSlotStart }) => timeSlotStart, slots) : slots,
            errors: error,
            isLoading: isMutating,
        },
        lastBooking: {
            data: booking,
            errors: lastBookingError,
            isLoading: isCreatingBooking,
            completed: Boolean(booking && !isCreatingBooking),
        },
        doctorsForSelectedAmbulance: {
            data: doctorsForSelectedAmbulance,
            errors: doctorsForSelectedAmbulanceError,
            isLoading: isLoadingDoctorsForSelectedAmbulance,
        },
        setters: {
            setActiveStep,
            setSelectedDate,
            setSelectedTime,
            setSelectedCategory,
            setSelectedAmbulance,
            setPreferredDoctor,
            setReservationBtnDisabled,
            setContactInfo,
        },
        api: {
            fetchAvailableTimeSlots,
            bookAnAppointment: () =>
                bookAnAppointment({
                    selectedAmbulanceId: selectedAmbulance,
                    contactInformation,
                    selectedCategory,
                    selectedDate,
                    selectedDoctor: preferredDoctor,
                    selectedTime,
                }),
            clearTimeSlots,
            clearBooking,
            clearReservation,
            getDoctorsForSelectedAmbulance,
            clearDoctorsForSelectedAmbulance,
        },
    }
    return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>
}

export default ReservationProvider
