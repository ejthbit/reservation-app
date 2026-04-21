import { isNilOrEmpty } from '../../utils'
import { TimeSlot } from './types'
import { AmbulanceService, DoctorService } from '../../types/AmbulanceService'
import { ReservationProcessData } from '../../components/Reservation/ReservationDialog/helpers/prepareReservationForCreation'

export const makeArrayOfLabelValue = <T extends any[]>(label: string, value: string, arr: T) =>
    arr.map((record) => ({ label: record[label], value: record[value] }))

export const makeReservationProcessInfo = ({
    selectedAmbulanceId,
    selectedDate,
    selectedTime,
    selectedDoctor,
    selectedCategory,
    contactInformation,
}: ReservationProcessData) => ({
    selectedAmbulanceId,
    selectedDate,
    selectedTime,
    selectedDoctor,
    selectedCategory,
    selectedMonth: selectedDate.slice(0, 7),
    contactInformation,
})

export const makeAppointmentDate = (appointmentDate: string, appointmentTime: string) =>
    `${appointmentDate} ${appointmentTime}`

export const makeAvailableTimeSlotsWithTimeOnly = (timeSlots: TimeSlot[]) =>
    timeSlots.map(({ timeSlotStart, timeSlotEnd }) => ({
        timeSlotStart: timeSlotStart.slice(11, 19),
        timeSlotEnd: timeSlotEnd.slice(11, 19),
    }))

export const makeServicesForSelectedMonth = (
    services: AmbulanceService[],
    month: string,
    selectedWorkplace: number,
) => (services ?? []).filter((service) => service.month === month && service.workplace === selectedWorkplace)

export const makeDoctorServicesByDoctorId = (service: AmbulanceService, doctorId: string) => {
    const getDayDoctorsBySelectedId = (doctors: DoctorService[], doctorId: string) =>
        doctors.find((d) => d.doctorId === doctorId)

    return isNilOrEmpty(doctorId)
        ? (service?.days ?? []).filter((day) => isNilOrEmpty(getDayDoctorsBySelectedId(day.doctors, doctorId)))
        : (service?.days ?? []).filter((d) => d.doctors.some((c) => c.doctorId === doctorId))
}
