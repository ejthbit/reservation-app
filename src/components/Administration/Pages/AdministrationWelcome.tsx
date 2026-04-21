import { CalendarMonth, CheckCircle, DateRange, Schedule, Today } from '@mui/icons-material'
import { Box, Fade, Typography, useTheme } from '@mui/material'
import {
    addMonths,
    endOfMonth,
    endOfToday,
    endOfWeek,
    format,
    getDay,
    isWeekend,
    startOfMonth,
    startOfToday,
    startOfWeek,
    subDays,
    subMonths,
} from 'date-fns'
import { cs } from 'date-fns/locale'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { useGetImmediateBookings } from '../../../context/Administration/AdministrationBookingsHooks'
import { useAdministration } from '../../../context/Administration/AdministrationProvider'
import { useUser } from '../../../context/User/UserProvider'
import { useGetCategories } from '../../../hooks/useGetCategories'
import { Booking, Category } from '../../../types'
import { getCategoryNameById, getISODateStringWithCorrectOffset } from '../../../utils'
import DashboardCategoryBars from './components/DashboardCategoryBars'
import DashboardHeatmapCalendar from './components/DashboardHeatmapCalendar'
import DashboardStatCard from './components/DashboardStatCard'
import DashboardTodaySchedule from './components/DashboardTodaySchedule'
import DashboardWeekdayChart from './components/DashboardWeekdayChart'

const getCategoryCounts = (data: Booking[] | undefined, categories: Category[] | undefined) => {
    const dataForReturn: number[] = []
    const labels: string[] = []
    if (!data || !categories) return { data: [], labels: [] }
    const counts: Record<string, number> = data.reduce(
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
    const weekdayCounts = Array(5).fill(0)
    data.forEach((item) => {
        const start = new Date(item.start)
        const dayOfWeek = getDay(start)
        if (!isWeekend(start)) weekdayCounts[dayOfWeek - 1]++
    })
    return weekdayCounts
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

const AdministrationWelcome = () => {
    const [heatmapDate, setHeatmapDate] = useState(new Date())
    const { name } = useUser()
    const { data: categories } = useGetCategories()
    const { selectedWorkspace } = useAdministration()
    const { enqueueSnackbar } = useSnackbar()

    const { data: todayBookingsReal, error: todayError } = useGetImmediateBookings({
        from: getISODateStringWithCorrectOffset(startOfToday()),
        to: getISODateStringWithCorrectOffset(endOfToday()),
        workplace: selectedWorkspace,
    })

    const todayBookings = todayBookingsReal ?? []

    const { data: bookingsInLastMonth, isLoading: isLoadingLast30, error: lastMonthError } = useGetImmediateBookings({
        from: getISODateStringWithCorrectOffset(subDays(startOfToday(), 30)),
        to: getISODateStringWithCorrectOffset(startOfToday()),
        workplace: selectedWorkspace,
    })

    const { data: currentMonthBookings, error: currentMonthError } = useGetImmediateBookings({
        from: getISODateStringWithCorrectOffset(startOfMonth(heatmapDate)),
        to: getISODateStringWithCorrectOffset(endOfMonth(heatmapDate)),
        workplace: selectedWorkspace,
    })

    const bookingsPerDay = useMemo(() => getBookingsPerDay(currentMonthBookings), [currentMonthBookings])
    const categoryCounts = useMemo(
        () => getCategoryCounts(bookingsInLastMonth, categories),
        [bookingsInLastMonth, categories],
    )
    const weekdayCounts = useMemo(() => getWeekdayCounts(bookingsInLastMonth), [bookingsInLastMonth])

    const todayCount = todayBookings?.length ?? 0
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

    const { data: thisWeekBookings, error: weekError } = useGetImmediateBookings({
        from: getISODateStringWithCorrectOffset(weekStart),
        to: getISODateStringWithCorrectOffset(weekEnd),
        workplace: selectedWorkspace,
    })
    const weekCount = thisWeekBookings?.length ?? 0

    useEffect(() => {
        if (todayError || lastMonthError || currentMonthError || weekError) {
            enqueueSnackbar('Nepodařilo se načíst data přehledu.', { variant: 'error' })
        }
    }, [todayError, lastMonthError, currentMonthError, weekError, enqueueSnackbar])
    const avgPerDay = bookingsInLastMonth ? Math.round(bookingsInLastMonth.length / 30) : 0
    const firstName = name?.split(' ')[0] ?? name
    const theme = useTheme()
    return (
        <Fade in timeout={{ enter: 500 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                {/* Header */}
                <Box>
                    <Typography
                        sx={{
                            fontSize: 12,
                            color: 'text.disabled',
                            mb: 0.5,
                            letterSpacing: 0.3,
                            textTransform: 'uppercase',
                        }}
                    >
                        {format(new Date(), 'EEEE, d. MMMM yyyy', { locale: cs })}
                    </Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 500, lineHeight: 1.2 }}>
                        Vítejte, {firstName}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>
                        Na dnešní den máte{' '}
                        <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>
                            {todayCount} objednávek
                        </Box>
                    </Typography>
                </Box>

                {/* Stat cards */}
                <Box sx={{ display: 'flex', gap: '12px' }}>
                    <DashboardStatCard
                        icon={<Today />}
                        label="Dnes"
                        value={todayCount}
                        subtitle="objednávek naplánováno"
                        bgColor={theme.palette.primary.main}
                        iconBgColor={theme.palette.primary.light}
                        textColor="#ffffff"
                        accentColor={theme.palette.primary.contrastText}
                    />
                    <DashboardStatCard
                        icon={<DateRange />}
                        label="Tento týden"
                        value={weekCount}
                        subtitle="objednávek tento týden"
                        bgColor={theme.palette.primary.light}
                        iconBgColor={theme.palette.primary.dark}
                        textColor="#26215C"
                        accentColor={theme.palette.primary.contrastText}
                    />
                    <DashboardStatCard
                        icon={<Schedule />}
                        label="Průměr"
                        value={`${avgPerDay} za den`}
                        subtitle="posledních 30 dnů"
                        bgColor={theme.palette.primary.dark}
                        iconBgColor={theme.palette.primary.main}
                        textColor="#26215C"
                        accentColor={theme.palette.primary.contrastText}
                    />
                </Box>

                {/* Two-column: heatmap + charts */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
                        gap: 2,
                    }}
                >
                    <DashboardHeatmapCalendar
                        bookingsPerDay={bookingsPerDay}
                        viewDate={heatmapDate}
                        onPrev={() => setHeatmapDate((d) => subMonths(d, 1))}
                        onNext={() => setHeatmapDate((d) => addMonths(d, 1))}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <DashboardCategoryBars categoryCounts={categoryCounts} isLoading={isLoadingLast30} />
                        <DashboardWeekdayChart weekdayCounts={weekdayCounts} isLoading={isLoadingLast30} />
                    </Box>
                </Box>

                {/* Today's schedule */}
                <DashboardTodaySchedule bookings={todayBookings} />
            </Box>
        </Fade>
    )
}

export default AdministrationWelcome
