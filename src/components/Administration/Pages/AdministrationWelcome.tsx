import { DateRange, Event, Newspaper, Schedule } from '@mui/icons-material'
import { Box, Button, CircularProgress, Fade, List, Typography } from '@mui/material'
import {
    endOfMonth,
    endOfToday,
    format,
    getDay,
    getDaysInMonth,
    isToday,
    isWeekend,
    startOfMonth,
    startOfToday,
    subDays,
} from 'date-fns'
import { cs } from 'date-fns/locale'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetCategories } from '../../../hooks/useGetCategories'
import { getCategoryNameById, getISODateStringWithCorrectOffset, isMobile } from '../../../utils'
import AdministrationDashboardTodayPatients from './components/AdministrationDashboardTodayPatients'

import { BarChart } from '@mui/x-charts/BarChart'
import { useGetImmediateBookings } from '../../../context/Administration/AdministrationBookingsHooks'
import { useAdministration } from '../../../context/Administration/AdministrationProvider'
import { useUser } from '../../../context/User/UserProvider'
import { Booking, Category } from '../../../types'

const getCategoryCounts = (data: Booking[] | undefined, categories: Category[] | undefined) => {
    const dataForReturn: number[] = []
    const labels: string[] = []

    if (!data || !categories) {
        return { data: [], labels: [] }
    }

    const counts: Record<string, number> = data?.reduce(
        (acc, curr) => {
            const category = curr.category.toString()
            acc[category] = (acc[category] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    Object.entries(counts).forEach(([categoryId, count]) => {
        const label = getCategoryNameById(categoryId, categories)
        if (label) labels.push(label)
        dataForReturn.push(count)
    })

    return { data: dataForReturn, labels }
}

const getWeekdayCounts = (data: Booking[] | undefined) => {
    if (!data) return []

    const weekdayCounts = Array(5).fill(0) // Initialize an array to hold counts for each weekday (Monday to Friday)

    data.forEach((item) => {
        const start = new Date(item.start) // Convert start date string to Date object
        const dayOfWeek = getDay(start) // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

        if (!isWeekend(start)) {
            // Check if the day falls on a weekend
            weekdayCounts[dayOfWeek - 1]++ // Increment the count for the corresponding weekday (shifted by one to start from Monday)
        }
    })

    return weekdayCounts
}

const RootBarChart = ({
    data,
    layout = 'horizontal',
    height,
}: {
    data: {
        data: number[]
        labels: string[]
    }
    layout?: 'horizontal' | 'vertical' | undefined
    height?: number
}) => {
    if (data && data.data.length > 0)
        return (
            <BarChart
                sx={(theme) => ({
                    py: 3,
                    '& .MuiBarElement-root': {
                        fill: '#4825A8',
                    },
                    '& .MuiChartsLegend-mark': {
                        fill: '#4825A8',
                    },
                })}
                series={[
                    {
                        data: data.data,
                        label: 'Počet',
                        id: 'number',
                        highlightScope: { faded: 'global', highlighted: 'series' },
                        layout,
                        // faded: { innerRadius: 30, additionalRadius: -30, color: 'black' },
                    },
                ]}
                {...(layout === 'horizontal'
                    ? { yAxis: [{ data: data.labels, scaleType: 'band' }] }
                    : { xAxis: [{ data: data.labels, scaleType: 'band' }] })}
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: { horizontal: 'middle', vertical: 'bottom' },
                        padding: 0,
                    },
                }}
                {...(height && { height })}
            />
        )
    else return null
}
const getBookingsPerDay = (bookings: Booking[] | undefined) => {
    const counts: Record<string, number> = {}
    if (!bookings) return counts
    bookings.forEach((b) => {
        const day = new Date(b.start).getDate()
        counts[day] = (counts[day] || 0) + 1
    })
    return counts
}

const MonthlyCalendar = ({ bookingsPerDay }: { bookingsPerDay: Record<string, number> }) => {
    const today = new Date()
    const daysInMonth = getDaysInMonth(today)
    const firstDayOfMonth = startOfMonth(today)
    // getDay returns 0=Sun, we want Mon=0
    const startOffset = (getDay(firstDayOfMonth) + 6) % 7
    const weekdays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']

    return (
        <Box sx={{ bgcolor: '#F9F9FB', borderRadius: 6, p: 3 }}>
            <Typography fontWeight="600" align="center" sx={{ fontSize: '1rem' }}>
                Počet objednávek na daný den
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center" display="block" mb={2}>
                {format(today, 'LLLL yyyy', { locale: cs }).replace(/^./, (c) => c.toUpperCase())}
            </Typography>
            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5} textAlign="center">
                {weekdays.map((d) => (
                    <Typography key={d} variant="caption" fontWeight="600" color="text.secondary">
                        {d}
                    </Typography>
                ))}
                {Array.from({ length: startOffset }).map((_, i) => (
                    <Box key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const date = new Date(today.getFullYear(), today.getMonth(), day)
                    const count = bookingsPerDay[day] || 0
                    const isTodayDate = isToday(date)
                    const isWeekendDate = isWeekend(date)

                    return (
                        <Box
                            key={day}
                            sx={{
                                py: 1,
                                borderRadius: 2,
                                ...(isTodayDate && {
                                    bgcolor: '#4825A8',
                                    color: 'white',
                                }),
                                ...(isWeekendDate &&
                                    !isTodayDate && {
                                        color: 'text.disabled',
                                    }),
                            }}
                        >
                            <Typography variant="body2" fontWeight={isTodayDate ? 700 : 400}>
                                {day}
                            </Typography>
                            {count > 0 && (
                                <Typography
                                    variant="caption"
                                    fontWeight="600"
                                    sx={{ color: isTodayDate ? 'white' : '#4825A8' }}
                                >
                                    {count}
                                </Typography>
                            )}
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

const quickActions = [
    { icon: <Event />, label: 'Objednávky', link: '/admin/orders' },
    { icon: <Schedule />, label: 'Rozpis směn', link: '/admin/services' },
    { icon: <DateRange />, label: 'Kalendář', link: '/admin/calendar' },
    { icon: <Newspaper />, label: 'Oznámení', link: '/admin/announcements' },
]

const AdministrationWelcome = () => {
    const navigate = useNavigate()
    const { name } = useUser()
    const { data: categories } = useGetCategories()
    const { selectedWorkspace } = useAdministration()
    const { data: todayBookings } = useGetImmediateBookings({
        from: getISODateStringWithCorrectOffset(startOfToday()),
        to: getISODateStringWithCorrectOffset(endOfToday()),
        workplace: selectedWorkspace,
    })

    const { data: bookingsInLastMonth, isLoading: isLoadingBookingsInLastMonth } = useGetImmediateBookings({
        from: getISODateStringWithCorrectOffset(subDays(startOfToday(), 30)),
        to: getISODateStringWithCorrectOffset(startOfToday()),
        workplace: selectedWorkspace,
    })

    const { data: currentMonthBookings } = useGetImmediateBookings({
        from: getISODateStringWithCorrectOffset(startOfMonth(new Date())),
        to: getISODateStringWithCorrectOffset(endOfMonth(new Date())),
        workplace: selectedWorkspace,
    })

    const bookingsPerDay = useMemo(() => getBookingsPerDay(currentMonthBookings), [currentMonthBookings])

    const categoryCounts = useMemo(
        () => getCategoryCounts(bookingsInLastMonth, categories),
        [bookingsInLastMonth, categories],
    )

    const weekDayCounts = useMemo(() => getWeekdayCounts(bookingsInLastMonth), [bookingsInLastMonth])

    return (
        <Fade in timeout={{ enter: 600 }}>
            <Box
                sx={{
                    width: '100%',
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={8}
                    mb={2}
                    sx={(theme) => ({
                        [theme.breakpoints.down('md')]: {
                            mt: 10,
                            mb: 14,
                        },
                    })}
                >
                    <Box display="flex" gap={0.5} flexDirection="column">
                        <Typography
                            variant="h3"
                            sx={(theme) => ({
                                color: '#4825A8',
                                display: 'flex',
                                flexDirection: 'column',
                            })}
                        >
                            <span>
                                <span style={{ fontWeight: 600 }}>Vítejte</span> {`${name}!`}
                            </span>
                        </Typography>
                        <Typography>
                            Na dnešní den je <strong>{todayBookings?.length} </strong> objednávek!
                            <br />
                            Před vývoláním zkontrolujte informace.
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" gap={2} mb={4} flexWrap="wrap">
                    {quickActions.map(({ icon, label, link }) => (
                        <Button
                            key={link}
                            variant="outlined"
                            startIcon={icon}
                            onClick={() => navigate(link)}
                            sx={{
                                borderColor: '#4825A8',
                                color: '#4825A8',
                                borderRadius: 3,
                                px: 3,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor: '#4825A8',
                                    color: 'white',
                                    borderColor: '#4825A8',
                                },
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </Box>
                <Box
                    display="flex"
                    gap={'3vw'}
                    mb={3}
                    sx={(theme) => ({
                        [theme.breakpoints.down('sm')]: {
                            flexDirection: 'column',
                        },
                    })}
                >
                    <Box display="flex" flexDirection="column" gap={3} sx={{ minWidth: 0 }}>
                        <AdministrationDashboardTodayPatients />
                        <MonthlyCalendar bookingsPerDay={bookingsPerDay} />
                    </Box>
                    {!isMobile && (
                        <Box
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            <List
                                sx={{
                                    width: '100%',
                                    bgcolor: '#F9F9FB',
                                    borderRadius: 6,
                                    height: '30vh',
                                    padding: 2,
                                }}
                            >
                                <Typography
                                    align="center"
                                    sx={{ mb: 1, ml: 3, mt: 1, fontSize: '1rem' }}
                                    fontWeight="600"
                                >
                                    Počet objednávek dle kategorie za posledních 30 dnů
                                </Typography>
                                {isLoadingBookingsInLastMonth ? (
                                    <CircularProgress />
                                ) : (
                                    <RootBarChart data={categoryCounts} />
                                )}
                            </List>
                            <List
                                sx={{
                                    width: '100%',
                                    bgcolor: '#F9F9FB',
                                    borderRadius: 6,
                                    height: '30vh',
                                }}
                            >
                                <Typography
                                    align="center"
                                    sx={{ mb: 1, ml: 3, mt: 1, fontSize: '1rem' }}
                                    fontWeight="600"
                                >
                                    Průměrný počet objednávek dle dnů za posledních 30 dnů
                                </Typography>
                                <Box display="flex" alignItems="center" justifyContent="center" height="80%">
                                    {isLoadingBookingsInLastMonth ? (
                                        <CircularProgress />
                                    ) : (
                                        <RootBarChart
                                            height={300}
                                            layout="vertical"
                                            data={{
                                                data: weekDayCounts,
                                                labels: ['Po', 'Út', 'St', 'Čt', 'Pá'],
                                            }}
                                        />
                                    )}
                                </Box>
                            </List>
                        </Box>
                    )}
                </Box>
            </Box>
        </Fade>
    )
}

export default AdministrationWelcome
