import { addMinutes } from 'date-fns'
import { ContactInformation } from '../../../../context/Reservation'

export type ReservationProcessData = {
    selectedDoctor?: number | string
    selectedDate: string
    selectedTime: string
    selectedAmbulanceId: number | null
    selectedCategory: number | string
    contactInformation: ContactInformation
}
const prepareReservationForCreation = ({
    selectedDoctor = '',
    selectedDate,
    selectedTime,
    selectedAmbulanceId,
    selectedCategory,
    contactInformation,
}: ReservationProcessData) => {
    const { name, email, phone, birthdate } = contactInformation
    const start = `${selectedDate}T${selectedTime}.000Z`
    return {
        ...((email || phone) && { contact: { email, phone } }),
        name,
        birthDate: birthdate?.slice(0, 10),
        start,
        end: addMinutes(new Date(start), import.meta.env.VITE_APPOINTMENT_DURATION).toISOString(),
        workplace: selectedAmbulanceId,
        category: selectedCategory,
        selected_doctor_id: selectedDoctor,
    }
}

export default prepareReservationForCreation
