import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Box, Button, Grid, Typography, styled, useTheme } from '@mui/material'
import { endOfDay, parse, startOfDay } from 'date-fns'
import { useEffect, useState } from 'react'
import { ToolbarProps } from 'react-big-calendar'
import { BookingEvent, BookingEventResource } from '../../../../utils/makeCalendarEventsFromBookings'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { useCalendarContext } from '../../../../context/Calendar/CalendarProvider'
import { isMobile } from '../../../../utils'

const StyledButton = styled(Button)(({ theme, variant }) => ({
    height: '40px',
    background:
        variant !== 'outlined' ? theme.palette.primary.main : `linear-gradient(to right, #1E1E2E, #111)`,
    color:
        variant !== 'outlined'
            ? theme.palette.getContrastText(theme.palette.primary.main)
            : theme.palette.getContrastText(theme.palette.secondary.main),
}))
const VIEW_TRANSLATIONS = {
    day: 'dnešní den',
    work_week: 'aktuální pracovní týden',
}
const AdministrationCalendarToolbar = ({
    label,
    date,
    onNavigate,
    onView,
}: ToolbarProps<BookingEvent, BookingEventResource>) => {
    const [viewState, setViewState] = useState<'day' | 'work_week'>(isMobile ? 'day' : 'work_week')
    const theme = useTheme()
    const { events } = useCalendarContext()

    const { selectViewDateRange } = useAdministration()
    const goToDayView = () => {
        onView('day')
        setViewState('day')
    }
    const goToWeekView = () => {
        onView('work_week')
        setViewState('work_week')
    }

    const goToBack = () => onNavigate('PREV')
    const goToNext = () => onNavigate('NEXT')

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
                            {`Počet objednávek na ${VIEW_TRANSLATIONS[viewState]}: ${
                                events.filter(
                                    ({ resource }) =>
                                        !resource?.blocked && !resource?.doctorService && !resource?.vacation,
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
                            variant={viewState === 'work_week' ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={goToWeekView}
                            fullWidth
                        >
                            Pracovní týden
                        </StyledButton>
                    </Grid>
                    <Grid item xs={4} md={6}>
                        <StyledButton
                            variant={viewState === 'day' ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={goToDayView}
                            fullWidth
                        >
                            Den
                        </StyledButton>
                    </Grid>
                </Grid>
                <Grid container item xs={12} justifyContent="flex-start" spacing={2} mt={0.5}>
                    {[
                        { color: '#fff', label: 'Volno', border: '1px solid #ccc' },
                        { color: theme.palette.primary.main, label: 'Objednávka' },
                        { color: 'green', label: 'Odbaveno' },
                        { color: 'grey', label: 'Zavřeno' },
                        { color: '#FF8F00', label: 'Dovolená' },
                        { color: 'red', label: 'Dnes' },
                    ].map(({ color, label: text, border }) => (
                        <Grid item key={text} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box
                                sx={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: '2px',
                                    backgroundColor: color,
                                    ...(border && { border }),
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {text}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Box>
    )
}

export default AdministrationCalendarToolbar
