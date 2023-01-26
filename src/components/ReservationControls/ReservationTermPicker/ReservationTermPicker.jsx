import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
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
    setSelectedCategory,
    setSelectedTime,
} from '../../../store/reservationProcess/reservationProcessSlice'
import { isNilOrEmpty } from '../../../utils'
import ReservationCategorySelect from '../ReservationCategorySelect'
import { ReservationTime } from './components'
import TermPicker from './Components/TermPicker'
const PREFIX = 'ReservationTermPicker'

const classes = {
    dayWithDotContainer: `${PREFIX}-dayWithDotContainer`,
    disabledDayContainer: `${PREFIX}-disabledDayContainer`,
    dayWithDot: `${PREFIX}-dayWithDot`,
    timepicker: `${PREFIX}-timepicker`,
}

const StyledGrid = styled(Grid)(({ theme }) => ({
    marginTop: theme.spacing(0.5),
    [`& .${classes.dayWithDotContainer}`]: {
        position: 'relative',
    },

    [`& .${classes.disabledDayContainer}`]: {
        pointerEvents: 'none',
        '& .MuiPickersDay-day': {
            opacity: 0.25,
        },
    },

    [`& .${classes.dayWithDot}`]: {
        position: 'absolute',
        height: 0,
        width: 0,
        border: '2px solid',
        borderRadius: 4,
        borderColor: theme.palette.primary.main,
        right: '47%',
        transform: 'translateX(1px)',
        top: '10%',
    },

    [`& .${classes.timepicker}`]: {
        marginTop: theme.spacing(1),
    },
}))
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
            <StyledGrid container direction="column">
                <TermPicker
                    doctorServicesBySelectedDoctorIdAndMonth={
                        doctorServicesBySelectedDoctorIdAndMonth
                    }
                />
                {!isNilOrEmpty(availableTimeSlots) ? (
                    <StyledGrid container direction="row" spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <ReservationTime step={step} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ReservationCategorySelect step={step} />
                        </Grid>
                    </StyledGrid>
                ) : !isNilOrEmpty(isDoctorServing) ? (
                    <Typography>Omlouváme se ale na tento den již nejsou volné termíny</Typography>
                ) : (
                    <Typography>
                        Omlouváme se ale tento den vámi vybranný doktor neordinuje
                    </Typography>
                )}
            </StyledGrid>
        </LocalizationProvider>
    )
}

export default ReservationTermPicker
