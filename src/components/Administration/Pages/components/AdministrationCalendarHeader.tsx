import { Box, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { cs } from 'date-fns/locale'
import { prop, sortBy } from 'ramda'
import { HeaderProps } from 'react-big-calendar'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { useDoctorServices } from '../../../../hooks'
import useCalendar from '../../../../hooks/useCalendar'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset } from '../../../../utils'

const AdministrationCalendarHeader = ({ date }: HeaderProps) => {
    const { selectedWorkspace } = useAdministration()
    const { doctors } = useCalendar()

    const {
        servicesDays,
        isLoadingServicesDays,
        api: { fetchDoctorServicesByRange },
    } = useDoctorServices()

    fetchDoctorServicesByRange({
        start: getISODateStringWithCorrectOffset(date),
        end: getISODateStringWithCorrectOffset(date),
        workplace: parseInt(selectedWorkspace),
    })

    return (
        isLoadingServicesDays && (
            <Box display="flex" flexDirection="column">
                <Typography fontWeight="500">{format(date, 'eeee dd/MM/yyyy', { locale: cs })}</Typography>
                {servicesDays &&
                    sortBy(prop('start'), servicesDays)?.map(({ doctorId, start, end }) => (
                        <Typography variant="caption" key={`${doctorId}-${start}-${end}`}>
                            {doctors[doctorId]} - {format(getDateWithCorrectOffset(start), 'HH:mm')} -{' '}
                            {format(getDateWithCorrectOffset(end), 'HH:mm')}
                        </Typography>
                    ))}
            </Box>
        )
    )
}

export default AdministrationCalendarHeader
