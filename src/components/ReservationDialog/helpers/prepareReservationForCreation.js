import { addMinutes } from 'date-fns'

const prepareReservationForCreation = ({
    selectedDoctor,
    selectedDate,
    selectedTime,
    selectedAmbulanceId,
    selectedCategory,
    contactInformation,
}) => {
    const { name, email, phone, birthDate } = contactInformation
    const start = `${selectedDate}T${selectedTime}.000Z`
    return {
        ...((email || phone) && { contact: { email, phone } }),
        name,
        birthDate,
        start,
        end: addMinutes(new Date(start), import.meta.env.VITE_APPOINTMENT_DURATION).toISOString(),
        workplace: selectedAmbulanceId,
        category: selectedCategory,
        selected_doctor_id: selectedDoctor,
    }
}
export default prepareReservationForCreation
