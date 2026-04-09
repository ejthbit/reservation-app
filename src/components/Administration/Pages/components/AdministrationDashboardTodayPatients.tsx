import {
    Avatar,
    Box,
    CircularProgress,
    Fade,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material'
import { addMinutes, format, subMinutes } from 'date-fns'
import { useEffect } from 'react'
import { useGetBookings } from '../../../../context/Administration/AdministrationBookingsHooks'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset, isNilOrEmpty } from '../../../../utils'

const from = getISODateStringWithCorrectOffset(
    subMinutes(new Date(), import.meta.env.VITE_APPOINTMENT_DURATION ?? 10),
)
const to = getISODateStringWithCorrectOffset(
    addMinutes(new Date(), import.meta.env.VITE_APPOINTMENT_DURATION ?? 10 * 4),
)

const AdministrationDashboardTodayPatients = () => {
    const { selectedWorkspace: workplace } = useAdministration()
    const { data: todayBookings, isMutating: isFetching, trigger: getBookings } = useGetBookings()

    // FIXME: Call with actual time
    useEffect(() => {
        getBookings({ from, to, workplace })
        const interval = setInterval(() => {
            getBookings({
                from,
                to,
                workplace,
            })
        }, 60000)

        return () => clearInterval(interval)
    }, [workplace])

    return (
        <Box width={{ md: '33.3vw', sm: '100%' }}>
            <List
                sx={{
                    width: '100%',
                    bgcolor: '#F9F9FB',
                    borderRadius: 6,
                    maxHeight: '40vh',
                    overflow: 'auto',
                    padding: 2,
                }}
            >
                <Typography align="center" sx={{ mb: 1, ml: 3, mt: 1, fontSize: '1rem' }} fontWeight="600">
                    Následující objednávky
                </Typography>
                {isNilOrEmpty(todayBookings) && (
                    <Box display="flex" alignItems="center" justifyContent="center" height="80%">
                        <Typography align="center">Nemáta žádné následující objednávky.</Typography>
                    </Box>
                )}
                {todayBookings
                    ? [...todayBookings]
                          .sort((a, b) => a.start.localeCompare(b.start))
                          .map(({ name, birthdate, start, id }) => (
                              <ListItem key={id} sx={{ bgcolor: '#F9F9FB' }}>
                                  <ListItemAvatar>
                                      <Avatar>
                                          <Avatar />
                                      </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                      sx={{ width: '30%' }}
                                      primary={name}
                                      secondary={
                                          format(new Date(), 'yyyy-MM-dd') === birthdate ? '' : birthdate
                                      }
                                  />
                                  <Typography sx={{ fontWeight: 600, fontSize: '2rem' }} color="primary">
                                      {format(getDateWithCorrectOffset(start), 'HH:mm')}
                                  </Typography>
                              </ListItem>
                          ))
                    : isFetching && (
                          <Fade in timeout={{ enter: 1000 }}>
                              <Box display="flex" alignItems="center" justifyContent="center">
                                  <CircularProgress
                                      size={100}
                                      sx={{ zIndex: '1200', position: 'fixed', top: '50vh', left: '50vw' }}
                                  />
                              </Box>
                          </Fade>
                      )}
            </List>
        </Box>
    )
}

export default AdministrationDashboardTodayPatients
