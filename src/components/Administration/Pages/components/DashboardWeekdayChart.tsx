import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'

type DashboardWeekdayChartProps = {
    weekdayCounts: number[]
    isLoading: boolean
}

const LABELS = ['Po', 'Út', 'St', 'Čt', 'Pá']
const CHART_HEIGHT = 120
const BAR_WIDTH = 32

const DashboardWeekdayChart = ({ weekdayCounts, isLoading }: DashboardWeekdayChartProps) => {
    const theme = useTheme()
    const counts = weekdayCounts.length === 5 ? weekdayCounts : Array(5).fill(0)
    const max = Math.max(...counts, 1)
    const maxIdx = counts.indexOf(Math.max(...counts))

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
            <Typography fontWeight={600} fontSize="0.95rem">
                Průměr na den v týdnu
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Posledních 30 dnů
            </Typography>

            {isLoading ? (
                <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                </Box>
            ) : (
                <Box display="flex" alignItems="flex-end" justifyContent="space-around" height={CHART_HEIGHT + 36}>
                    {LABELS.map((label, i) => {
                        const count = counts[i] ?? 0
                        const barH = max === 0 ? 0 : Math.max((count / max) * CHART_HEIGHT, count > 0 ? 4 : 0)
                        const isMax = i === maxIdx && count > 0
                        const color = isMax
                            ? theme.palette.primary.main
                            : alpha(theme.palette.primary.main, 0.4)

                        return (
                            <Box
                                key={label}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                gap={0.5}
                                sx={{ userSelect: 'none' }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color,
                                        minHeight: 16,
                                        lineHeight: 1,
                                    }}
                                >
                                    {count > 0 ? count : ''}
                                </Typography>
                                <Box
                                    sx={{
                                        width: BAR_WIDTH,
                                        height: barH,
                                        bgcolor: color,
                                        borderRadius: '6px 6px 2px 2px',
                                        transition: 'height 0.4s ease',
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    {label}
                                </Typography>
                            </Box>
                        )
                    })}
                </Box>
            )}
        </Box>
    )
}

export default DashboardWeekdayChart
