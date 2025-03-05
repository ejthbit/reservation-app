import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Box, Button, Grid, Typography, styled } from '@mui/material'
import { addDays, addWeeks, endOfDay, parse, startOfDay } from 'date-fns'
import { equals } from 'ramda'
import { useEffect, useState } from 'react'
import { ToolbarProps } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { withTheme } from '../../../../hoc'
import useCalendar from '../../../../hooks/useCalendar'
import { isMobile } from '../../../../utils'

const StyledButton = styled(Button)(({ theme, variant }) => ({
    borderRadius: theme.spacing(3),
    height: '40px',
    color: variant === 'outlined' ? theme.palette.primary.main : theme.palette.common.white,
}))
const VIEW_TRANSLATIONS = {
    day: 'dnešní den',
    work_week: 'aktuální pracovní týden',
}
const AdministrationCalendarToolbar = ({ label, date, onNavigate, onView }: ToolbarProps) => {
    const [viewState, setViewState] = useState<'day' | 'work_week'>(isMobile ? 'day' : 'work_week')
    const { events } = useCalendar()

    const { selectViewDateRange } = useAdministration()
    const goToDayView = () => {
        onView('day')
        setViewState('day')
    }
    const goToWeekView = () => {
        onView('work_week')
        setViewState('work_week')
    }

    const goToBack = () => {
        if (viewState === 'work_week') onNavigate('PREV', addWeeks(date, -1))
        else onNavigate('PREV', addDays(date, -1))
    }

    const goToNext = () => {
        if (viewState === 'work_week') onNavigate('NEXT', addWeeks(date, +1))
        else onNavigate('NEXT', addDays(date, +1))
    }

    const goToToday = () => {
        const now = new Date()
        date.setMonth(now.getMonth())
        date.setFullYear(now.getFullYear())
        date.setDate(now.getDate())
        onNavigate('TODAY')
    }

    useEffect(() => {
        if (label) {
            const labelWithoutSeparator = label.split(' - ')
            selectViewDateRange({
                from: startOfDay(parse(labelWithoutSeparator[0]!!, 'dd/MM/yyyy', new Date())).toISOString(),
                to: endOfDay(
                    parse(labelWithoutSeparator[1] ?? labelWithoutSeparator[0]!!, 'dd/MM/yyyy', new Date()),
                ).toISOString(),
            })
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
                                    ({ resource }) => !resource?.blocked && !resource?.doctorService,
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

export default withTheme(AdministrationCalendarToolbar)
