import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
    format,
    getDay,
    getDaysInMonth,
    isToday,
    isWeekend,
    startOfMonth,
} from 'date-fns'
import { cs } from 'date-fns/locale'

type DashboardHeatmapCalendarProps = {
    bookingsPerDay: Record<string, number>
    viewDate: Date
    onPrev: () => void
    onNext: () => void
}

const weekdays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']

const DashboardHeatmapCalendar = ({ bookingsPerDay, viewDate, onPrev, onNext }: DashboardHeatmapCalendarProps) => {
    const theme = useTheme()

    const daysInMonth = getDaysInMonth(viewDate)
    const firstDayOfMonth = startOfMonth(viewDate)
    const startOffset = (getDay(firstDayOfMonth) + 6) % 7

    const getCountForDay = (day: number): number => {
        return bookingsPerDay[day.toString()] ?? 0
    }

    const getHeatColor = (count: number): string => {
        if (count === 0) return alpha(theme.palette.primary.main, 0.05)
        if (count <= 3) return alpha(theme.palette.primary.main, 0.15)
        if (count <= 7) return alpha(theme.palette.primary.main, 0.35)
        if (count <= 12) return alpha(theme.palette.primary.main, 0.6)
        return theme.palette.primary.main
    }

    const legend = [
        { color: alpha(theme.palette.primary.main, 0.05), label: '0' },
        { color: alpha(theme.palette.primary.main, 0.15), label: '1–3' },
        { color: alpha(theme.palette.primary.main, 0.35), label: '4–7' },
        { color: alpha(theme.palette.primary.main, 0.6), label: '8–12' },
        { color: theme.palette.primary.main, label: '13+' },
    ]

    return (
        <Box
            sx={{
                bgcolor: 'white',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                p: 2.5,
            }}
        >
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={0.5}>
                <Box>
                    <Typography fontWeight={600} fontSize="0.95rem">
                        {format(viewDate, 'LLLL yyyy', { locale: cs }).replace(/^./, (c) => c.toUpperCase())}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Počet objednávek na daný den
                    </Typography>
                </Box>
                <Box display="flex" gap={0.5}>
                    <IconButton size="small" onClick={onPrev}>
                        <ChevronLeft fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={onNext}>
                        <ChevronRight fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5} textAlign="center" mt={1.5}>
                {weekdays.map((d) => (
                    <Typography key={d} variant="caption" fontWeight={600} color="text.secondary">
                        {d}
                    </Typography>
                ))}
                {Array.from({ length: startOffset }).map((_, i) => (
                    <Box key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
                    const count = getCountForDay(day)
                    const isTodayDate = isToday(date)
                    const isWeekendDate = isWeekend(date)
                    const heatColor = getHeatColor(count)

                    return (
                        <Tooltip
                            key={day}
                            title={count > 0 ? `${count} objednávek` : ''}
                            arrow
                            placement="top"
                        >
                            <Box
                                sx={{
                                    py: 0.75,
                                    borderRadius: 1.5,
                                    bgcolor: isTodayDate ? theme.palette.primary.main : heatColor,
                                    color: isTodayDate
                                        ? 'white'
                                        : isWeekendDate
                                          ? 'text.disabled'
                                          : 'text.primary',
                                    boxShadow: isTodayDate
                                        ? `0 0 0 2px white, 0 0 0 4px ${theme.palette.primary.main}`
                                        : 'none',
                                    transition: 'transform 0.1s',
                                    '&:hover': { transform: 'scale(1.1)' },
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    fontWeight={isTodayDate ? 700 : 400}
                                    display="block"
                                    lineHeight={1.2}
                                >
                                    {day}
                                </Typography>
                                {count > 0 && (
                                    <Typography
                                        sx={(theme) => ({
                                            fontSize: '0.6rem',
                                            fontWeight: 700,
                                            color: theme.palette.getContrastText(theme.palette.primary.main),
                                            lineHeight: 1.2,
                                        })}
                                    >
                                        {count}
                                    </Typography>
                                )}
                            </Box>
                        </Tooltip>
                    )
                })}
            </Box>

            <Box display="flex" alignItems="center" gap={0.75} mt={2} justifyContent="flex-end">
                <Typography variant="caption" color="text.secondary">
                    Méně
                </Typography>
                {legend.map((l) => (
                    <Tooltip key={l.label} title={l.label} placement="top">
                        <Box
                            sx={{
                                width: 14,
                                height: 14,
                                borderRadius: 0.5,
                                bgcolor: l.color,
                                border: '1px solid',
                                borderColor: 'divider',
                                cursor: 'default',
                            }}
                        />
                    </Tooltip>
                ))}
                <Typography variant="caption" color="text.secondary">
                    Více
                </Typography>
            </Box>
        </Box>
    )
}

export default DashboardHeatmapCalendar
