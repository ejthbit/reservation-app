import { Booking } from 'src/types'
import { TriggerWithArgs } from 'swr/mutation'
import { TimeSlotRequestData } from './ReservationFetchers'
import { Doctor } from 'src/types/Doctor'

export type ContactInformation = {
    name: string
    email?: string
    phone?: string
    birthdate: string | null
}

type LastBooking = {
    isLoading: boolean
    errors: Error | undefined
    completed: boolean
    data?: Booking // You can replace 'Record<string, any>' with a more specific type if you know the structure of the data
}

export type TimeSlot = {
    timeSlotStart: string
    timeSlotEnd: string
}

type AvailableTimeSlots = {
    isLoading: boolean
    errors: Error | undefined
    slots?: TimeSlot[]
}
type DoctorsForSelectedAmbulance = {
    data?: Doctor[]
    errors: Error | undefined
    isLoading: boolean
}

type BookingState = {
    selectedAmbulance: number | null
    preferredDoctor: number | string
    selectedDate: string
    selectedTime: string
    selectedCategory: string | number
    activeStep: string
    availableTimeSlots: AvailableTimeSlots
    contactInformation: ContactInformation
    isReservationBtnDisabled: boolean
    lastBooking: LastBooking
    doctorsForSelectedAmbulance: DoctorsForSelectedAmbulance
    setters: {
        setActiveStep: React.Dispatch<React.SetStateAction<string>>
        setSelectedDate: (date: Date) => void
        setSelectedTime: React.Dispatch<React.SetStateAction<string>>
        setSelectedCategory: React.Dispatch<React.SetStateAction<string | number>>
        setSelectedAmbulance: React.Dispatch<React.SetStateAction<number | null>>
        setPreferredDoctor: React.Dispatch<React.SetStateAction<string | number>>
        setReservationBtnDisabled: React.Dispatch<React.SetStateAction<boolean>>
        setContactInfo: (payload: Record<string, string | null>) => void
    }
    api: {
        fetchAvailableTimeSlots?: TriggerWithArgs<TimeSlot[], Error, string, TimeSlotRequestData>
        bookAnAppointment: () => void
        clearTimeSlots: () => void
        clearBooking: () => void
        clearReservation: () => void
        getDoctorsForSelectedAmbulance?: TriggerWithArgs<Doctor[], Error, string, number>
        clearDoctorsForSelectedAmbulance: () => void
    }
}

export type { BookingState }
