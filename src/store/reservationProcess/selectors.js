import { createSelector } from '@reduxjs/toolkit'
import { equals, filter, find, isEmpty, map, path, propEq, sortBy } from 'ramda'
import { isNilOrEmpty } from '../../utils'

const stateId = 'reservationProcess'
export const makeArrayOfLabelValue = (label, value, arr) =>
    map((record) => ({ label: record[label], value: record[value] }), arr)

export const getActiveStep = path([stateId, 'activeStep'])
export const getSelectedDate = path([stateId, 'selectedDate'])
export const getSelectedAmbulance = path([stateId, 'selectedAmbulance'])
export const getSelectedCategory = path([stateId, 'selectedCategory'])
export const getAmbulances = path([stateId, '/', 'ambulances', 'data'])
export const getAvailableTimeSlots = path([stateId, 'availableTimeSlots', 'slots'])
export const getBookingCategories = path([stateId, '/', 'bookingCategories', 'data'])
export const getDoctorsForSelectedAmbulance = path([
    stateId,
    '/',
    'doctorsForSelectedAmbulance',
    'data',
])
export const getPreferredDoctor = path([stateId, 'preferredDoctor'])
export const getSelectedTime = path([stateId, 'selectedTime'])
export const getContactInformation = path([stateId, 'contactInformation'])
export const getDisabledReservationBtn = path([stateId, 'isReservationBtnDisabled'])
export const getLastBooking = path([stateId, 'lastBooking'])

export const makeReservationProcessInfo = () =>
    createSelector(
        [
            getSelectedAmbulance,
            getSelectedDate,
            getSelectedTime,
            getPreferredDoctor,
            getSelectedCategory,
            getContactInformation,
        ],
        (
            selectedAmbulanceId,
            selectedDate,
            selectedTime,
            selectedDoctor,
            selectedCategory,
            contactInformation
        ) => ({
            selectedAmbulanceId,
            selectedDate,
            selectedTime,
            selectedDoctor,
            selectedCategory,
            selectedMonth: selectedDate.slice(0, 7),
            contactInformation,
        })
    )

export const makeAppointmentDate = () =>
    createSelector(
        [getSelectedDate, getSelectedTime],
        (appointmentDate, appointmentTime) => `${appointmentDate} ${appointmentTime}`
    )

export const makeAvailableTimeSlotsWithTimeOnly = () =>
    createSelector([getAvailableTimeSlots], (timeSlots) =>
        sortBy(
            propEq('timeSlotStart'),
            map(({ timeSlotStart, timeSlotEnd }) => {
                return {
                    timeSlotStart: timeSlotStart.slice(11, 19),
                    timeSlotEnd: timeSlotEnd.slice(11, 19),
                }
            }, timeSlots)
        )
    )
export const makeServicesForSelectedMonth = (services = [], month, selectedWorkplace) =>
    filter(
        (service) => equals(service.month, month) && equals(service.workplace, selectedWorkplace),
        services
    )

export const makeDoctorServicesByDoctorId = (service, doctorId) => {
    const getDayDoctorsBySelectedId = (doctors, doctorId) =>
        find(propEq('doctorId', Number(doctorId)), doctors)

    return isEmpty(doctorId)
        ? filter(
              (day) => isNilOrEmpty(getDayDoctorsBySelectedId(day.doctors, doctorId)),
              service?.days ?? []
          )
        : filter((d) => {
              return d.doctors.some((c) => [Number(doctorId)].includes(c.doctorId))
          }, service?.days ?? [])
}
