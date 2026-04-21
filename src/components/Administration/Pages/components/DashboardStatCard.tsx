import { Box, Typography } from '@mui/material'
import { ReactNode } from 'react'

type DashboardStatCardProps = {
    icon: ReactNode
    label: string
    value: number | string
    subtitle: string
    bgColor: string
    iconBgColor: string
    textColor?: string
    accentColor?: string
}

const DashboardStatCard = ({
    icon,
    label,
    value,
    subtitle,
    bgColor,
    iconBgColor,
    textColor = 'text.primary',
    accentColor,
}: DashboardStatCardProps) => {
    return (
        <Box
            sx={{
                bgcolor: bgColor,
                borderRadius: 3,
                p: 2.5,
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
            }}
        >
            <Box display="flex" alignItems="center" gap={1}>
                <Box
                    sx={{
                        bgcolor: iconBgColor,
                        borderRadius: 2,
                        p: 0.75,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        '& svg': { fontSize: 20 },
                    }}
                >
                    {icon}
                </Box>
                <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ color: accentColor ?? textColor, lineHeight: 1.1 }}
                >
                    {label}
                </Typography>
            </Box>
            <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: accentColor ?? textColor, lineHeight: 1.1 }}
            >
                {value}
            </Typography>
            <Typography variant="caption" sx={{ color: accentColor ?? textColor, lineHeight: 1.1 }}>
                {subtitle}
            </Typography>
        </Box>
    )
}

export default DashboardStatCard
