import { Box, Typography } from '@mui/material'
import { endOfDay, format, parseISO, startOfDay } from 'date-fns'
import { cs } from 'date-fns/locale'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { getUserConfigurationSelectedAmbulance } from '../../../../store/administration'
import { useGetDoctorServicesByRangeQuery } from '../../../../store/reservationProcess'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset } from '../../../../utils'
import useCalendar from '../../../../hooks/useCalendar'

const sortByStartDate = (array) =>
    [...array].sort((a, b) => {
        const dateA = new Date(a.start)
        const dateB = new Date(b.start)
        return dateA - dateB
    })

const AdministrationCalendarHeader = ({ date, label, localizer }) => {
    const selectedAmbulanceId = useSelector(getUserConfigurationSelectedAmbulance)
    const { doctors } = useCalendar()
    const { currentData: servicesDays = [], isFetching: isLoadingServicesDays } =
        useGetDoctorServicesByRangeQuery({
            start: getISODateStringWithCorrectOffset(date),
            end: getISODateStringWithCorrectOffset(date),
            workplace: selectedAmbulanceId,
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
