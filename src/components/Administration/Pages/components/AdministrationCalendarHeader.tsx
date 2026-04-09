import { Box, Typography } from '@mui/material'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { useMemo } from 'react'
import { HeaderProps } from 'react-big-calendar'
import { useCalendarContext } from '../../../../context/Calendar/CalendarProvider'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset } from '../../../../utils'

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
        <Box display="flex" flexDirection="column">
            <Typography fontWeight="500">{format(date, 'eeee dd/MM/yyyy', { locale: cs })}</Typography>
            {servicesForDay.length > 0 ? (
                servicesForDay.map(({ doctorId, start, end }) => (
                    <Typography variant="caption" key={`${doctorId}-${start}-${end}`}>
                        {doctors[doctorId]} - {format(getDateWithCorrectOffset(start), 'HH:mm')} -{' '}
                        {format(getDateWithCorrectOffset(end), 'HH:mm')}
                    </Typography>
                ))
            ) : (
                <Typography variant="caption" color="crimson">
                    Zavřeno
                </Typography>
            )}
        </Box>
    )
}

export default AdministrationCalendarHeader
