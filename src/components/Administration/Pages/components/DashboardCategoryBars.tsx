import { Box, CircularProgress, LinearProgress, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'

type DashboardCategoryBarsProps = {
    categoryCounts: { data: number[]; labels: string[] }
    isLoading: boolean
}

const DashboardCategoryBars = ({ categoryCounts, isLoading }: DashboardCategoryBarsProps) => {
    const theme = useTheme()
    const max = Math.max(...(categoryCounts.data.length > 0 ? categoryCounts.data : [1]), 1)

    const barColors = [
        theme.palette.primary.main,
        theme.palette.primary.dark,
        theme.palette.primary.light,
        alpha(theme.palette.primary.main, 0.6),
        alpha(theme.palette.primary.dark, 0.7),
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
            <Typography fontWeight={600} fontSize="0.95rem">
                Kategorie objednávek
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                Posledních 30 dnů
            </Typography>

            {isLoading ? (
                <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                </Box>
            ) : categoryCounts.data.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    Žádná data
                </Typography>
            ) : (
                <Box display="flex" flexDirection="column" gap={1.5}>
                    {categoryCounts.labels.map((label, i) => {
                        const count = categoryCounts.data[i] ?? 0
                        const pct = (count / max) * 100
                        const color = barColors[i % barColors.length]

                        return (
                            <Box key={label}>
                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: '75%' }}>
                                        {label}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={700} sx={{ color }}>
                                        {count}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={pct}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: color,
                                            borderRadius: 4,
                                        },
                                    }}
                                />
                            </Box>
                        )
                    })}
                </Box>
            )}
        </Box>
    )
}

export default DashboardCategoryBars
