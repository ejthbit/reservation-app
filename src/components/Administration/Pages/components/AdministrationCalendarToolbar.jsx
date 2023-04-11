import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Box, Button, Grid, styled, Typography } from '@mui/material'
import { addDays, addWeeks, endOfDay, parse, startOfDay } from 'date-fns'
import PropTypes from 'prop-types'
import { equals } from 'ramda'
import { useEffect, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useDispatch } from 'react-redux'
import { withTheme } from '../../../../hoc'
import useCalendar from '../../../../hooks/useCalendar'
import { setBookingsViewDate } from '../../../../store/administration/administrationSlice'
import { isMobile, isNilOrEmpty } from '../../../../utils'
const StyledButton = styled(Button)(({ theme, variant }) => ({
    height: '40px',
    color: variant === 'outlined' ? theme.palette.primary.main : theme.palette.common.white,
}))
const VIEW_TRANSLATIONS = {
    day: 'dnešní den',
    work_week: 'aktuální pracovní týden',
}
const AdministrationCalendarToolbar = ({ label, date, onNavigate, onView }) => {
    const [viewState, setViewState] = useState(isMobile ? 'day' : 'work_week')
    const { events } = useCalendar()
    const dispatch = useDispatch()

    const goToDayView = () => {
        onView('day')
        setViewState('day')
    }
    const goToWeekView = () => {
        onView('work_week')
        setViewState('work_week')
    }

    const goToBack = () => {
        if (viewState === 'work_week') onNavigate('prev', addWeeks(date, -1))
        else onNavigate('prev', addDays(date, -1))
    }

    const goToNext = () => {
        if (viewState === 'work_week') onNavigate('next', addWeeks(date, +1))
        else onNavigate('next', addDays(date, +1))
    }

    const goToToday = () => {
        const now = new Date()
        date.setMonth(now.getMonth())
        date.setYear(now.getFullYear())
        date.setDate(now.getDate())
        onNavigate('current')
    }

    useEffect(() => {
        if (!isNilOrEmpty(label)) {
            dispatch(
                setBookingsViewDate({
                    from: startOfDay(parse(label.split(' - ')[0], 'dd/MM/yyyy', new Date())).toISOString(),
                    to: endOfDay(
                        parse(label.split(' - ')[1] ?? label.split(' - ')[0], 'dd/MM/yyyy', new Date())
                    ).toISOString(),
                })
            )
        }
    }, [label])
    return (
        <Box marginBottom={2}>
            <Grid container spacing={1} justifyContent="center" alignItems="stretch">
                <Grid container item xs={12} justifyContent="space-between" spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1" align="left">
                            {`Počet objednaných pacientek na ${VIEW_TRANSLATIONS[viewState]}: ${
                                events.filter(
                                    ({ resource }) => !resource?.blocked && !resource?.doctorService
                                ).length
                            } `}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            align={isMobile ? 'center' : 'right'}
                        >{`Časové období: ${label}`}</Typography>
                    </Grid>
                </Grid>
                <Grid container item xs={12} md={6} justifyContent="space-between" spacing={1}>
                    <Grid item xs={4} md={4}>
                        <StyledButton variant="contained" color="primary" onClick={goToBack} fullWidth>
                            <ArrowBack />
                        </StyledButton>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <StyledButton variant="outlined" color="primary" onClick={goToToday} fullWidth>
                            DNES
                        </StyledButton>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <StyledButton variant="contained" color="primary" onClick={goToNext} fullWidth>
                            <ArrowForward />
                        </StyledButton>
                    </Grid>
                </Grid>
                <Grid container item xs={12} md={6} spacing={1}>
                    <Grid item xs={8} md={6}>
                        <StyledButton
                            variant={equals(viewState, 'work_week') ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={goToWeekView}
                            fullWidth
                        >
                            Pracovní týden
                        </StyledButton>
                    </Grid>
                    <Grid item xs={4} md={6}>
                        <StyledButton
                            variant={equals(viewState, 'day') ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={goToDayView}
                            fullWidth
                        >
                            Den
                        </StyledButton>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}
AdministrationCalendarToolbar.propTypes = {
    label: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    onNavigate: PropTypes.func,
    onView: PropTypes.func,
}

export default withTheme(AdministrationCalendarToolbar)
