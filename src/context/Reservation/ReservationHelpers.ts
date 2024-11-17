import { equals, filter, find, isEmpty, map, propEq } from 'ramda'
import { isNilOrEmpty } from '../../utils'
import { TimeSlot } from './types'
import { AmbulanceService, DoctorService } from '../../types/AmbulanceService'
import { ReservationProcessData } from '../../components/Reservation/ReservationDialog/helpers/prepareReservationForCreation'

export const makeArrayOfLabelValue = (label: string, value: string, arr: any[]) =>
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
    map(({ timeSlotStart, timeSlotEnd }) => {
        return {
            timeSlotStart: timeSlotStart.slice(11, 19),
            timeSlotEnd: timeSlotEnd.slice(11, 19),
        }
    }, timeSlots)

export const makeServicesForSelectedMonth = (
    services: AmbulanceService[],
    month: string,
    selectedWorkplace: number,
) =>
    filter(
        (service) => Boolean(equals(service.month, month) && equals(service.workplace, selectedWorkplace)),
        services ?? [],
    )

export const makeDoctorServicesByDoctorId = (service: AmbulanceService, doctorId: string) => {
    const getDayDoctorsBySelectedId = (doctors: DoctorService[], doctorId: string) =>
        find(propEq('doctorId', doctorId), doctors)

    return isEmpty(doctorId)
        ? filter((day) => isNilOrEmpty(getDayDoctorsBySelectedId(day.doctors, doctorId)), service?.days ?? [])
        : filter((d) => {
              return d.doctors.some((c) => [doctorId].includes(c.doctorId))
          }, service?.days ?? [])
}
