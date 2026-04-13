import axiosGynInstance from '../../api/config'
import prepareReservationForCreation, {
    ReservationProcessData,
} from '../../components/Reservation/ReservationDialog/helpers/prepareReservationForCreation'
import { Booking, UpdatedBooking } from '../../types'

export const fetchBookings = async ({
    from,
    to,
    workplace,
}: {
    from: string
    to: string
    workplace: string
}) => {
    const { data } = await axiosGynInstance.get<Booking[]>(`bookings/getBookings/${from}/${to}/${workplace}`)
    return data
}

export const createBooking = async (bookingData: ReservationProcessData) => {
    const { data } = await axiosGynInstance.post(
        `bookings/booking`,
        prepareReservationForCreation(bookingData),
    )
    return data
}

export const updateBooking = async ({
    id,
    name,
    start,
    end,
    category,
    contact = undefined,
    note = undefined,
    workplace,
    birthdate,
    completed,
}: UpdatedBooking) => {
    const updatedBooking: UpdatedBooking = {
        id,
        name,
        birthdate: birthdate ? birthdate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        start,
        end,
        workplace,
        contact,
        category,
        completed,
        ...(note && { note }),
    }
    const { data } = await axiosGynInstance.put(`bookings/booking/${updatedBooking.id}`, updatedBooking)
    return data
}

export const deleteBooking = async (bookingId: string) => {
    const { data } = await axiosGynInstance.delete(`bookings/booking/${bookingId}`)
    return data
}
