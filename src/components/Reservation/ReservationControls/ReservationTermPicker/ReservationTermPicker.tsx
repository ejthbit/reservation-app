import { Grid, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { cs } from 'date-fns/locale'
import { equals, forEach, propEq } from 'ramda'
import { useEffect, useMemo, useState } from 'react'
import {
    makeAvailableTimeSlotsWithTimeOnly,
    makeDoctorServicesByDoctorId,
    useReservation,
} from 'src/context/Reservation'
import { useDoctorServices } from 'src/hooks'
import { AmbulanceServiceDay } from 'src/types/AmbulanceService'
import { getDateWithCorrectOffset, isNilOrEmpty } from '../../../../utils'
import ReservationCategorySelect from '../ReservationCategorySelect'
import { ReservationTime, TermPicker } from './components'
import { format } from 'date-fns'

const ReservationTermPicker = ({ step }: { step: string }) => {
    const {
        selectedAmbulance: selectedAmbulanceId,
        availableTimeSlots,
        selectedDate,
        selectedTime,
        preferredDoctor: selectedDoctor,
        selectedCategory,
        api: { clearTimeSlots, fetchAvailableTimeSlots },
        setters: { setSelectedCategory, setSelectedTime, setReservationBtnDisabled },
    } = useReservation()

    const [isDoctorServing, setIsDoctorServing] = useState<any>(undefined)
    console.log({ isDoctorServing })
    const availableTimeSlotsWithTimeOnly = useMemo(
        () => (availableTimeSlots.slots ? makeAvailableTimeSlotsWithTimeOnly(availableTimeSlots.slots) : {}),
        [availableTimeSlots, selectedDate],
    )

    const {
        doctorsServicesForSelectedAmbulance,
        api: { fetchDoctorServicesForSelectedMonth },
    } = useDoctorServices()

    useEffect(() => {
        if (selectedAmbulanceId) {
            fetchDoctorServicesForSelectedMonth({
                month: selectedDate.slice(0, 7),
                workplace: selectedAmbulanceId,
            })
        }
    }, [selectedDate, selectedAmbulanceId])

    const doctorServicesBySelectedDoctorIdAndMonth = useMemo(
        () =>
            doctorsServicesForSelectedAmbulance
                ? makeDoctorServicesByDoctorId(doctorsServicesForSelectedAmbulance, selectedDoctor.toString())
                : ([] as AmbulanceServiceDay[]),
        [doctorsServicesForSelectedAmbulance, selectedDoctor],
    )

    useEffect(() => {
        const servesItem = doctorServicesBySelectedDoctorIdAndMonth.find((serviceItem) => {
            if (!isNilOrEmpty(serviceItem?.doctors)) {
                return equals(serviceItem.date, selectedDate)
            }
        })
        const servingDoctor = !isNilOrEmpty(selectedDoctor)
            ? servesItem?.doctors.find(propEq('doctorId', selectedDoctor))
            : servesItem?.doctors

        if (!isNilOrEmpty(servingDoctor)) {
            clearTimeSlots()
            setIsDoctorServing(servingDoctor)
        } else {
            setIsDoctorServing(undefined)
            setReservationBtnDisabled(true)
            clearTimeSlots()
            if (!isNilOrEmpty(selectedTime)) setSelectedTime('')
            if (!isNilOrEmpty(selectedCategory)) setSelectedCategory('')
        }
    }, [selectedDate, doctorServicesBySelectedDoctorIdAndMonth])

    useEffect(() => {
        if (!isNilOrEmpty(isDoctorServing) && fetchAvailableTimeSlots && selectedAmbulanceId) {
            !Array.isArray(isDoctorServing)
                ? fetchAvailableTimeSlots({
                      from: isDoctorServing?.start,
                      to: isDoctorServing?.end,
                      workplace: selectedAmbulanceId.toString(),
                  })
                : forEach(
                      ({ start, end }) =>
                          fetchAvailableTimeSlots({
                              from: start,
                              to: end,
                              workplace: selectedAmbulanceId.toString(),
                          }),
                      isDoctorServing,
                  )
        }
    }, [isDoctorServing])

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={cs}
            localeText={{ okButtonLabel: 'Potvrdit', cancelButtonLabel: 'Zavřít' }}
        >
            <Grid container direction="column" sx={(theme) => ({ marginTop: theme.spacing(0.5) })}>
                <TermPicker
                    doctorServicesBySelectedDoctorIdAndMonth={doctorServicesBySelectedDoctorIdAndMonth}
                />
                {!isNilOrEmpty(availableTimeSlotsWithTimeOnly) ? (
                    <Grid
                        container
                        direction="row"
                        spacing={2}
                        sx={(theme) => ({ marginTop: theme.spacing(0.5) })}
                    >
                        <Grid item xs={12} sm={6}>
                            <ReservationTime step={step} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ReservationCategorySelect isRequired step={step} />
                        </Grid>
                    </Grid>
                ) : !isNilOrEmpty(isDoctorServing) ? (
                    <Typography>Omlouváme se ale na tento den již nejsou volné termíny</Typography>
                ) : (
                    <Typography>Omlouváme se ale tento den vámi vybranný doktor neordinuje</Typography>
                )}
            </Grid>
        </LocalizationProvider>
    )
}

export default ReservationTermPicker
