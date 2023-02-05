import { createSelector } from '@reduxjs/toolkit'
import { equals, filter, find, isEmpty, map, path, propEq } from 'ramda'
import { isNilOrEmpty } from '../../utils'
import { STATE_KEY } from './reservationProcessSlice'

export const makeArrayOfLabelValue = (label, value, arr) =>
    map((record) => ({ label: record[label], value: record[value] }), arr)

export const getActiveStep = path([STATE_KEY, 'activeStep'])
export const getSelectedDate = path([STATE_KEY, 'selectedDate'])
export const getSelectedAmbulance = path([STATE_KEY, 'selectedAmbulance'])
export const getSelectedCategory = path([STATE_KEY, 'selectedCategory'])
export const getAmbulances = path([STATE_KEY, '/', 'ambulances', 'data'])
export const getAreAvailableTimeSlotsLoading = path([STATE_KEY, 'availableTimeSlots', 'isLoading'])
export const getAvailableTimeSlots = path([STATE_KEY, 'availableTimeSlots', 'slots'])
export const getBookingCategories = path([STATE_KEY, '/', 'bookingCategories', 'data'])
export const getPreferredDoctor = path([STATE_KEY, 'preferredDoctor'])
export const getSelectedTime = path([STATE_KEY, 'selectedTime'])
export const getContactInformation = path([STATE_KEY, 'contactInformation'])
export const getDisabledReservationBtn = path([STATE_KEY, 'isReservationBtnDisabled'])
export const getLastBooking = path([STATE_KEY, 'lastBooking'])

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
        map(({ timeSlotStart, timeSlotEnd }) => {
            return {
                timeSlotStart: timeSlotStart.slice(11, 19),
                timeSlotEnd: timeSlotEnd.slice(11, 19),
            }
        }, timeSlots)
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
        ? filter((day) => isNilOrEmpty(getDayDoctorsBySelectedId(day.doctors, doctorId)), service?.days ?? [])
        : filter((d) => {
              return d.doctors.some((c) => [Number(doctorId)].includes(c.doctorId))
          }, service?.days ?? [])
}
