import CustomTable from '../../common/CustomTable/CustomTable'
import { Button, Fade, Grid, TextField, Typography } from '@mui/material'
import { endOfDay, endOfMonth, endOfWeek, parseISO, startOfDay, startOfMonth, startOfWeek } from 'date-fns'
import { isNilOrEmpty } from '../../../utils'
import { MobileDatePicker } from '@mui/x-date-pickers'
import { useDispatch, useSelector } from 'react-redux'
import { getBookingsSelectedDate, getUserConfigurationSelectedAmbulance } from '../../../store/administration'
import { useLazyGetBookingsQuery } from '../../../store/administration/services'
import { setBookingsViewDate } from '../../../store/administration/administrationSlice'
import { useEffect } from 'react'

const AdministrationOrders = () => {
    const dispatch = useDispatch()
    const bookingsViewDate = useSelector(getBookingsSelectedDate)
    const selectedAmbulanceId = useSelector(getUserConfigurationSelectedAmbulance)
    const [getBookings, { data: bookings = [], isFetching: isLoadingEventsForSelectedView }] =
        useLazyGetBookingsQuery()
    const handleChangeDate = (data) => dispatch(setBookingsViewDate({ ...bookingsViewDate, ...data }))
    const handleSetTodayDate = () =>
        dispatch(
            setBookingsViewDate({
                from: startOfDay(Date.now()).toISOString(),
                to: endOfDay(Date.now()).toISOString(),
            })
        )

    const handleSetThisWeekDate = () =>
        dispatch(
            setBookingsViewDate({
                from: startOfWeek(Date.now(), { weekStartsOn: 1 }).toISOString(),
                to: endOfWeek(Date.now(), { weekStartsOn: 1 }).toISOString(),
            })
        )

    const handleSetThisMonthDate = () =>
        dispatch(
            setBookingsViewDate({
                from: startOfMonth(Date.now()).toISOString(),
                to: endOfMonth(Date.now()).toISOString(),
            })
        )

    useEffect(() => {
        const { from, to } = bookingsViewDate
        if (!isNilOrEmpty(from) && !isNilOrEmpty(to))
            getBookings({ from, to, workplace: selectedAmbulanceId })
        if (!isNilOrEmpty(from) && isNilOrEmpty(to))
            getBookings({
                from,
                to: endOfDay(new Date(from)).toISOString(),
                workplace: selectedAmbulanceId,
            })
    }, [bookingsViewDate, selectedAmbulanceId])

    const headCells = [
        { id: 'start', numeric: false, disablePadding: false, label: 'Datum návštevy' },
        { id: 'start', numeric: false, disablePadding: false, label: 'Čas návštevy' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Jméno' },
        { id: 'birthdate', numeric: false, disablePadding: false, label: 'Datum narození' },
        { id: 'email', numeric: true, disablePadding: false, label: 'E-mail' },
        { id: 'phone', numeric: true, disablePadding: false, label: 'Telefon' },
        { id: 'completed', disableSorting: true, disablePadding: false, label: 'Odbaveno' },
    ]

    return (
        <Fade in timeout={500}>
            <Grid container>
                <Grid item container alignItems="flex-end" spacing={2}>
                    <Grid item xs={12} sm={2}>
                        <MobileDatePicker
                            label="Termíny od: "
                            orientation="landscape"
                            variant="inline"
                            inputFormat="dd-MM-yyyy"
                            mask="__-__-____"
                            margin="none"
                            value={bookingsViewDate.from}
                            maxDate={
                                !isNilOrEmpty(bookingsViewDate.to) ? parseISO(bookingsViewDate.to) : undefined
                            }
                            renderInput={(props) => <TextField variant="standard" {...props} />}
                            onChange={(date) => handleChangeDate({ from: startOfDay(date).toISOString() })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <MobileDatePicker
                            label="Termíny do: "
                            orientation="landscape"
                            variant="inline"
                            inputFormat="dd-MM-yyyy"
                            mask="__-__-____"
                            margin="none"
                            minDate={parseISO(bookingsViewDate.from)}
                            value={
                                isNilOrEmpty(bookingsViewDate.to)
                                    ? bookingsViewDate.from
                                    : bookingsViewDate.to
                            }
                            renderInput={(props) => <TextField variant="standard" {...props} />}
                            onChange={(date) => handleChangeDate({ to: endOfDay(date).toISOString() })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button variant="outlined" color="primary" onClick={handleSetTodayDate} fullWidth>
                            Dnes
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button variant="outlined" color="primary" onClick={handleSetThisWeekDate} fullWidth>
                            Týden
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button variant="outlined" color="primary" onClick={handleSetThisMonthDate} fullWidth>
                            Měsíc
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Typography
                            variant="body1"
                            color="primary"
                        >{`Počet objednávek na dané období: ${bookings.length}`}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <CustomTable orderBy="start" data={bookings} headCells={headCells} />
                </Grid>
            </Grid>
        </Fade>
    )
}

export default AdministrationOrders
