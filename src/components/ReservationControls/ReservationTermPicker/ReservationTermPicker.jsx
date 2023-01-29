import { Grid, Typography } from '@mui/material'
import { equals, find, propEq } from 'ramda'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { cs } from 'date-fns/locale'
import { useMemoizedSelector } from '../../../hooks'
import {
    makeAvailableTimeSlotsWithTimeOnly,
    makeDoctorServicesByDoctorId,
    makeReservationProcessInfo,
    useGetDoctorServicesForMonthQuery,
} from '../../../store/reservationProcess'
import {
    clearTimeSlots,
    fetchAvailableTimeSlots,
    fetchAvailableTimeSlotsForDoctors,
    setReservationBtnDisabled,
    setSelectedCategory,
    setSelectedTime,
} from '../../../store/reservationProcess/reservationProcessSlice'
import { isNilOrEmpty } from '../../../utils'
import ReservationCategorySelect from '../ReservationCategorySelect'
import { ReservationTime } from './components'
import TermPicker from './Components/TermPicker'

const getReservationProcessInfo = makeReservationProcessInfo()
const ReservationTermPicker = ({ step }) => {
    const dispatch = useDispatch()

    const {
        selectedAmbulanceId,
        selectedDate,
        selectedTime,
        selectedMonth,
        selectedDoctor,
        selectedCategory,
    } = useSelector(getReservationProcessInfo)

    const [isDoctorServing, setIsDoctorServing] = useState(undefined)

    const availableTimeSlots = useMemoizedSelector(makeAvailableTimeSlotsWithTimeOnly, {}, [
        selectedDate,
    ])

    // eslint-disable-next-line no-unused-vars
    const { data: doctorsServicesForSelectedAmbulance } = useGetDoctorServicesForMonthQuery({
        month: selectedMonth,
        workplace: selectedAmbulanceId,
    })
    const doctorServicesBySelectedDoctorIdAndMonth =
        useMemo(
            () => makeDoctorServicesByDoctorId(doctorsServicesForSelectedAmbulance, selectedDoctor),
            [doctorsServicesForSelectedAmbulance, selectedDoctor]
        ) ?? []

    useEffect(() => {
        const servesItem = find(({ date, doctors }) => {
            if (!isNilOrEmpty(doctors)) {
                return equals(date, selectedDate)
            }
        }, doctorServicesBySelectedDoctorIdAndMonth)
        const servingDoctor = !isNilOrEmpty(selectedDoctor)
            ? servesItem?.doctors.find(propEq('doctorId', Number(selectedDoctor)))
            : servesItem?.doctors
        if (!isNilOrEmpty(servingDoctor)) {
            dispatch(clearTimeSlots())
            setIsDoctorServing(servingDoctor)
            dispatch(
                !Array.isArray(servingDoctor)
                    ? fetchAvailableTimeSlots({
                          from: servingDoctor.start,
                          to: servingDoctor.end,
                          workplace: selectedAmbulanceId,
                      })
                    : fetchAvailableTimeSlotsForDoctors(servingDoctor, selectedAmbulanceId)
            )
        } else {
            setIsDoctorServing(undefined)
            dispatch(setReservationBtnDisabled(true))
            dispatch(clearTimeSlots())
            if (!isNilOrEmpty(selectedTime)) dispatch(setSelectedTime(''))
            if (!isNilOrEmpty(selectedCategory)) dispatch(setSelectedCategory(''))
        }
    }, [selectedDate, doctorServicesBySelectedDoctorIdAndMonth])

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={cs}
            localeText={{ okButtonLabel: 'Potvrdit', cancelButtonLabel: 'Zavřít' }}
        >
            <Grid container direction="column" sx={(theme) => ({ marginTop: theme.spacing(0.5) })}>
                <TermPicker
                    doctorServicesBySelectedDoctorIdAndMonth={
                        doctorServicesBySelectedDoctorIdAndMonth
                    }
                />
                {!isNilOrEmpty(availableTimeSlots) ? (
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
                            <ReservationCategorySelect step={step} />
                        </Grid>
                    </Grid>
                ) : !isNilOrEmpty(isDoctorServing) ? (
                    <Typography>Omlouváme se ale na tento den již nejsou volné termíny</Typography>
                ) : (
                    <Typography>
                        Omlouváme se ale tento den vámi vybranný doktor neordinuje
                    </Typography>
                )}
            </Grid>
        </LocalizationProvider>
    )
}

export default ReservationTermPicker
