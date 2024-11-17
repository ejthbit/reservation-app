import { Box, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { cs } from 'date-fns/locale'
import { useMemo } from 'react'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import useCalendar from '../../../../hooks/useCalendar'
import { useGetDoctorServicesByRangeQuery } from '../../../../store/reservationProcess'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset } from '../../../../utils'

const sortByStartDate = (array) =>
    [...array].sort((a, b) => {
        const dateA = new Date(a.start)
        const dateB = new Date(b.start)
        return dateA - dateB
    })

const AdministrationCalendarHeader = ({ date, label, localizer }) => {
    const { selectedWorkspace } = useAdministration()
    const { doctors } = useCalendar()
    const { currentData: servicesDays = [], isFetching: isLoadingServicesDays } =
        useGetDoctorServicesByRangeQuery({
            start: getISODateStringWithCorrectOffset(date),
            end: getISODateStringWithCorrectOffset(date),
            workplace: selectedWorkspace,
        })

    const sortedServices = useMemo(() => sortByStartDate(servicesDays), [servicesDays])
    return (
        <Box display="flex" flexDirection="column">
            <Typography fontWeight="500">{format(date, 'eeee dd/MM/yyyy', { locale: cs })}</Typography>
            {sortedServices?.map(({ doctorId, start, end }) => (
                <Typography variant="caption" key={`${doctorId}-${start}-${end}`}>
                    {doctors[doctorId]} - {format(getDateWithCorrectOffset(parseISO(start)), 'HH:mm')} -{' '}
                    {format(getDateWithCorrectOffset(parseISO(end)), 'HH:mm')}
                </Typography>
            ))}
        </Box>
    )
}

export default AdministrationCalendarHeader
