import { Box, CircularProgress, Fade, Hidden, List, Typography } from '@mui/material'
import { endOfToday, getDay, isWeekend, startOfToday, subDays } from 'date-fns'
import { useMemo } from 'react'
import imgLogo from '../../../assets/stetoscope.svg'
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
                        fill: theme.palette.primary.main,
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
const AdministrationWelcome = () => {
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
                    mb={5}
                    height={'20vh'}
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
                                color: theme.palette.primary.main,
                                display: 'flex',
                                flexDirection: 'column',
                            })}
                        >
                            <span>
                                <span style={{ fontWeight: 600 }}>Vítejte</span> {`${name}!`}
                            </span>
                        </Typography>
                        <Typography>
                            Na dnešní den je objednáno <strong>{todayBookings?.length} </strong> pacientů!
                            <br />
                            Před vývoláním zkontrolujte kartu pacienta.
                        </Typography>
                    </Box>
                    <Hidden smDown>
                        <img src={imgLogo} alt="Welcome logo" height={175} />
                    </Hidden>
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
                    <AdministrationDashboardTodayPatients />
                    {!isMobile && (
                        <Box
                            width={{
                                md: '66.6vw',
                                sm: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '3vw',
                            }}
                        >
                            <List
                                sx={(theme) => ({
                                    width: '100%',
                                    bgcolor: '#F9F9FB',
                                    borderRadius: 6,
                                    height: '30vh',
                                    padding: 2,
                                })}
                            >
                                <Typography
                                    align="center"
                                    sx={{ mb: 1, ml: 3, mt: 1, fontSize: '1rem' }}
                                    fontWeight="600"
                                >
                                    Počet pacientu dle kategorie za posledních 30 dnů
                                </Typography>
                                {isLoadingBookingsInLastMonth ? (
                                    <CircularProgress />
                                ) : (
                                    <RootBarChart data={categoryCounts} />
                                )}
                            </List>
                            <List
                                sx={() => ({
                                    width: '100%',
                                    bgcolor: '#F9F9FB',
                                    borderRadius: 6,
                                    height: '30vh',
                                })}
                            >
                                <Typography
                                    align="center"
                                    sx={{ mb: 1, ml: 3, mt: 1, fontSize: '1rem' }}
                                    fontWeight="600"
                                >
                                    Průměrný počet pacientu dle dnů za posledních 30 dnů
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
