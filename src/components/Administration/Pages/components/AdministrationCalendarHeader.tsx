import { Box, Typography } from '@mui/material'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { useMemo } from 'react'
import { HeaderProps } from 'react-big-calendar'
import { useCalendarContext } from '../../../../context/Calendar/CalendarProvider'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset, isMobile } from '../../../../utils'

const AdministrationCalendarHeader = ({ date }: HeaderProps) => {
    const { doctors, servicesDays } = useCalendarContext()

    const dateStr = format(date, 'yyyy-MM-dd')

    const servicesForDay = useMemo(
        () =>
            [...servicesDays]
                .filter(({ start }) =>
                    getISODateStringWithCorrectOffset(getDateWithCorrectOffset(start)).startsWith(dateStr),
                )
                .sort((a, b) => a.start.localeCompare(b.start)),
        [servicesDays, dateStr],
    )

    return (
        <Box display="flex" flexDirection="column" sx={{ lineHeight: 1.3 }}>
            <Typography fontSize={isMobile ? 10 : 14} fontWeight="500">
                {format(date, isMobile ? 'EEE dd/MM' : 'eeee dd/MM/yyyy', { locale: cs })}
            </Typography>
            {servicesForDay.length > 0 ? (
                servicesForDay.map(({ doctorId, start, end }) => (
                    <Box key={`${doctorId}-${start}-${end}`}>
                        <Typography fontSize={isMobile ? 9 : 12} variant="caption" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                            {doctors[doctorId]}
                        </Typography>
                        <Typography fontSize={isMobile ? 9 : 12} variant="caption" sx={{ display: 'block' }}>
                            {format(getDateWithCorrectOffset(start), 'HH:mm')}–{format(getDateWithCorrectOffset(end), 'HH:mm')}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography fontSize={isMobile ? 9 : 12} variant="caption" color="crimson">
                    Zavřeno
                </Typography>
            )}
        </Box>
    )
}

export default AdministrationCalendarHeader
