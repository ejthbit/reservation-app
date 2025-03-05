import { Button, Fade, Grid, TextField, Typography } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers'
import { endOfDay, endOfMonth, endOfWeek, parseISO, startOfDay, startOfMonth, startOfWeek } from 'date-fns'
import CustomTable from '../../common/CustomTable/CustomTable'

import { useEffect } from 'react'
import { useGetBookings } from '../../../context/Administration/AdministrationBookingsHooks'
import {
    SelectedViewDateRange,
    useAdministration,
} from '../../../context/Administration/AdministrationProvider'
import { getDateWithCorrectOffset } from '../../../utils'

const AdministrationOrders = () => {
    const { selectedViewDateRange, selectedWorkspace, selectViewDateRange } = useAdministration()

    const { trigger: getBookings, data: bookings = [] } = useGetBookings()

    const handleChangeDate = (date: SelectedViewDateRange) =>
        selectViewDateRange({ ...selectedViewDateRange, ...date })
    const handleSetTodayDate = () =>
        selectViewDateRange({
            from: startOfDay(Date.now()).toISOString(),
            to: endOfDay(Date.now()).toISOString(),
        })

    const handleSetThisWeekDate = () =>
        selectViewDateRange({
            from: startOfWeek(Date.now(), { weekStartsOn: 1 }).toISOString(),
            to: endOfWeek(Date.now(), { weekStartsOn: 1 }).toISOString(),
        })

    const handleSetThisMonthDate = () =>
        selectViewDateRange({
            from: startOfMonth(Date.now()).toISOString(),
            to: endOfMonth(Date.now()).toISOString(),
        })

    useEffect(() => {
        if (!selectedViewDateRange) return

        const { from, to } = selectedViewDateRange ?? {}

        if (from && to) {
            getBookings({ from, to, workplace: selectedWorkspace })
        } else if (from) {
            getBookings({
                from,
                to: endOfDay(new Date(from)).toISOString(),
                workplace: selectedWorkspace,
            })
        }
    }, [selectedViewDateRange, selectedWorkspace])

    const headCells = [
        { id: 'start', numeric: false, disablePadding: false, label: 'Datum návštevy' },
        { id: 'start', numeric: false, disablePadding: false, label: 'Čas návštevy' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Jméno' },
        { id: 'birthdate', numeric: false, disablePadding: false, label: 'Datum narození' },
        { id: 'email', numeric: true, disablePadding: false, label: 'E-mail' },
        { id: 'phone', numeric: true, disablePadding: false, label: 'Telefon' },
        { id: 'completed', disableSorting: true, disablePadding: false, label: 'Odbaveno' },
    ]

    const controlButtons = [
        { label: 'dnes', onClick: handleSetTodayDate },
        { label: 'týden', onClick: handleSetThisWeekDate },
        { label: 'měsíc', onClick: handleSetThisMonthDate },
    ]

    return (
        <Fade in timeout={500}>
            <Grid container>
                <Grid item container alignItems="flex-end" spacing={2}>
                    <Grid item xs={12} sm={2}>
                        <MobileDatePicker
                            label="Termíny od: "
                            orientation="landscape"
                            // variant="inline"
                            loading={!!selectedViewDateRange?.from}
                            format="dd-MM-yyyy"
                            // margin="none"
                            value={
                                selectedViewDateRange?.from
                                    ? getDateWithCorrectOffset(selectedViewDateRange?.from)
                                    : null
                            }
                            maxDate={
                                selectedViewDateRange?.to ? parseISO(selectedViewDateRange?.to) : undefined
                            }
                            slots={{ textField: (props) => <TextField variant="standard" {...props} /> }}
                            onChange={(date) =>
                                date && handleChangeDate({ from: startOfDay(date).toISOString() })
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <MobileDatePicker
                            label="Termíny do: "
                            orientation="landscape"
                            // variant="inline"
                            format="dd-MM-yyyy"
                            loading={!!selectedViewDateRange?.from}
                            // margin="none"
                            minDate={
                                selectedViewDateRange?.from
                                    ? parseISO(selectedViewDateRange?.from)
                                    : undefined
                            }
                            value={
                                !selectedViewDateRange?.to
                                    ? getDateWithCorrectOffset(selectedViewDateRange?.from!!)
                                    : getDateWithCorrectOffset(selectedViewDateRange?.to)
                            }
                            slots={{ textField: (props) => <TextField variant="standard" {...props} /> }}
                            onChange={(date) =>
                                date && handleChangeDate({ to: endOfDay(date).toISOString() })
                            }
                        />
                    </Grid>
                    {controlButtons.map(({ label, onClick }) => (
                        <Grid item xs={12} sm={2}>
                            <Button variant="outlined" color="primary" onClick={onClick} fullWidth>
                                {label}
                            </Button>
                        </Grid>
                    ))}
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
