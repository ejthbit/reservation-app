import { TimeSlot } from './types'
import prepareReservationForCreation, {
    ReservationProcessData,
} from '../../components/Reservation/ReservationDialog/helpers/prepareReservationForCreation'
import axiosGynInstance from '../../api/config'
import { Booking } from '../../types'

export type TimeSlotRequestData = { from: string; to: string; workplace: string }

const APPOINTMENT_DURATION = import.meta.env.VITE_APPOINTMENT_DURATION
export const getAvailableTimeSlotsFetcher = async ({ from, to, workplace }: TimeSlotRequestData) =>
    (
        await axiosGynInstance.get<TimeSlot[]>(
            decodeURI(`bookings/getAvailableSlots/${from}/${to}/${APPOINTMENT_DURATION}/${workplace}`),
        )
    ).data

export const createBookingFetcher = async (reservationData: ReservationProcessData) =>
    (await axiosGynInstance.post(
        `bookings/booking`,
        prepareReservationForCreation(reservationData),
    )) as Booking

export const getDoctorsForSelectedAmbulanceFetcher = async (ambulanceId: number) =>
    (await axiosGynInstance.get(`configuration/getDoctors/${ambulanceId}`)).data.data
