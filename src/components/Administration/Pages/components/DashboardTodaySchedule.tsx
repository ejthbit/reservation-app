import { Box, Button, Chip, Typography, useTheme } from '@mui/material'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { Booking } from '../../../../types'
import { getDateWithCorrectOffset } from '../../../../utils'

type DashboardTodayScheduleProps = {
    bookings: Booking[] | undefined
}

const capitalize = (s: string) =>
    s
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')

const MAX_VISIBLE = 8

const DashboardTodaySchedule = ({ bookings }: DashboardTodayScheduleProps) => {
    const theme = useTheme()
    const navigate = useNavigate()

    const now = new Date()
    const all = bookings ?? []
    const past = all
        .filter((b) => getDateWithCorrectOffset(b.end) <= now)
        .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
        .slice(0, 2)
    const future = all.filter((b) => getDateWithCorrectOffset(b.end) > now)
    const combined = [...past, ...future].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    const count = combined.length
    const sorted = combined
    const visible = sorted.slice(0, MAX_VISIBLE)

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
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                <Box>
                    <Typography fontWeight={600} fontSize="0.95rem">
                        Dnešní rozvrh
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {count} objednávek
                    </Typography>
                </Box>
                <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/admin/calendar')}
                    sx={{ textTransform: 'none', fontWeight: 500, fontSize: '0.8rem' }}
                >
                    Zobrazit vše →
                </Button>
            </Box>

            {count === 0 ? (
                <Typography variant="body2" color="text.secondary" mt={2}>
                    Na dnes nejsou žádné objednávky
                </Typography>
            ) : (
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    gap={1.5}
                    mt={1.5}
                >
                    {visible.map((booking) => {
                        const isCompleted = booking.completed
                        const borderColor = isCompleted ? '#0F6E56' : theme.palette.primary.dark
                        const bgColor = isCompleted ? '#E1F5EE' : theme.palette.primary.light
                        const startDate = getDateWithCorrectOffset(booking.start)
                        const endDate = getDateWithCorrectOffset(booking.end)
                        const timeRange = `${format(startDate, 'HH:mm')} – ${format(endDate, 'HH:mm')}`

                        return (
                            <Box
                                key={booking.id}
                                sx={{
                                    bgcolor: bgColor,
                                    borderLeft: `4px solid ${borderColor}`,
                                    borderRadius: '0 10px 10px 0',
                                    p: 1.5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.5,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    fontWeight={600}
                                    color="text.secondary"
                                    lineHeight={1}
                                >
                                    {timeRange}
                                </Typography>
                                <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
                                    {capitalize(booking.name)}
                                </Typography>
                                {booking.contact?.phone ? (
                                    <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
                                        {booking.contact?.phone}
                                    </Typography>
                                ) : null}

                                {isCompleted && (
                                    <Chip
                                        label="Hotovo"
                                        size="small"
                                        sx={{
                                            bgcolor: '#0F6E56',
                                            color: 'white',
                                            fontSize: '0.65rem',
                                            height: 18,
                                            alignSelf: 'flex-start',
                                        }}
                                    />
                                )}
                            </Box>
                        )
                    })}
                </Box>
            )}
        </Box>
    )
}

export default DashboardTodaySchedule
