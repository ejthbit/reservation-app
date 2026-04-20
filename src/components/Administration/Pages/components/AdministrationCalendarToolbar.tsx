import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'
import { endOfDay, parse, startOfDay } from 'date-fns'
import { useEffect, useState } from 'react'
import { ToolbarProps } from 'react-big-calendar'
import { BookingEvent, BookingEventResource } from '../../../../utils/makeCalendarEventsFromBookings'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { useCalendarContext } from '../../../../context/Calendar/CalendarProvider'
import { isMobile } from '../../../../utils'

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

    const bookingCount = events.filter(
        ({ resource }) => !resource?.blocked && !resource?.doctorService && !resource?.vacation,
    ).length

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

    const navButtonSx = {
        width: 34,
        height: 34,
        borderRadius: '9px',
        backgroundColor: '#fff',
        border: '0.5px solid',
        borderColor: theme.palette.divider,
        '&:hover': {
            backgroundColor: theme.palette.grey[100],
        },
    }

    return (
        <Box sx={{ mb: 2 }}>
            {/* Header row */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                {/* Left: title + subtitle */}
                <Box>
                    <Typography sx={{ fontSize: 22, fontWeight: 500, lineHeight: 1.2 }}>
                        Kalendář
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.25 }}>
                        <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>
                            {bookingCount}
                        </Box>
                        {' objednávek · '}
                        {viewState === 'work_week' ? 'Pracovní týden' : 'Den'}
                        {' '}
                        {label}
                    </Typography>
                </Box>

                {/* Right: view toggle + navigation */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* View toggle pill */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            backgroundColor: '#fff',
                            border: '0.5px solid',
                            borderColor: theme.palette.divider,
                            borderRadius: '9px',
                            padding: '3px',
                        }}
                    >
                        <Button
                            size="small"
                            onClick={goToWeekView}
                            disableElevation
                            sx={{
                                borderRadius: '7px',
                                textTransform: 'none',
                                fontSize: 13,
                                px: 1.5,
                                py: 0.5,
                                minWidth: 0,
                                backgroundColor:
                                    viewState === 'work_week' ? theme.palette.secondary.main : 'transparent',
                                color:
                                    viewState === 'work_week' ? '#fff' : theme.palette.text.secondary,
                                '&:hover': {
                                    backgroundColor:
                                        viewState === 'work_week'
                                            ? theme.palette.secondary.dark
                                            : theme.palette.action.hover,
                                },
                            }}
                        >
                            Týden
                        </Button>
                        <Button
                            size="small"
                            onClick={goToDayView}
                            disableElevation
                            sx={{
                                borderRadius: '7px',
                                textTransform: 'none',
                                fontSize: 13,
                                px: 1.5,
                                py: 0.5,
                                minWidth: 0,
                                backgroundColor:
                                    viewState === 'day' ? theme.palette.secondary.main : 'transparent',
                                color:
                                    viewState === 'day' ? '#fff' : theme.palette.text.secondary,
                                '&:hover': {
                                    backgroundColor:
                                        viewState === 'day'
                                            ? theme.palette.secondary.dark
                                            : theme.palette.action.hover,
                                },
                            }}
                        >
                            Den
                        </Button>
                    </Box>

                    {/* Navigation */}
                    <IconButton onClick={goToBack} sx={navButtonSx}>
                        <ArrowBack sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={goToToday}
                        disableElevation
                        sx={{
                            borderRadius: '9px',
                            textTransform: 'none',
                            fontSize: 13,
                            height: 34,
                            px: 2,
                        }}
                    >
                        Dnes
                    </Button>
                    <IconButton onClick={goToNext} sx={navButtonSx}>
                        <ArrowForward sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Legend bar */}
            <Box
                sx={{
                    backgroundColor: '#fff',
                    border: '0.5px solid',
                    borderColor: theme.palette.divider,
                    borderRadius: '10px',
                    padding: '10px 16px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '18px',
                    alignItems: 'center',
                }}
            >
                {[
                    { color: '#fff', label: 'Volno', border: '1px solid #ccc' },
                    { color: theme.palette.primary.main, label: 'Objednávka' },
                    { color: '#0F6E56', label: 'Odbaveno' },
                    { color: '#D3D1C7', label: 'Zavřeno' },
                    { color: '#EF9F27', label: 'Dovolená' },
                    { color: '#E24B4A', label: 'Dnes' },
                ].map(({ color, label: text, border }) => (
                    <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '3px',
                                backgroundColor: color,
                                flexShrink: 0,
                                ...(border && { border }),
                            }}
                        />
                        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{text}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default AdministrationCalendarToolbar
