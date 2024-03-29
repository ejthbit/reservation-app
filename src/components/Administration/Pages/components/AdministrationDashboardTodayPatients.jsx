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
import { equals, map, prop, sortBy } from 'ramda'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUserConfigurationSelectedAmbulance } from '../../../../store/administration'
import { useLazyGetBookingsQuery } from '../../../../store/administration/services'
import { getUserInfo } from '../../../../store/userInfo'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset, isNilOrEmpty } from '../../../../utils'

const fromDate = new Date()
const from = getISODateStringWithCorrectOffset(
    subMinutes(fromDate, import.meta.env.VITE_APPOINTMENT_DURATION)
)
const to = getISODateStringWithCorrectOffset(
    addMinutes(fromDate, import.meta.env.VITE_APPOINTMENT_DURATION * 4)
)
const AdministrationDashboardTodayPatients = () => {
    const workplace = useSelector(
        (state) => getUserConfigurationSelectedAmbulance(state) ?? getUserInfo(state)?.default_workplace
    )

    const [getBookings, { data: todayBookings, isFetching }] = useLazyGetBookingsQuery()
    // FIXME: Call with actual time
    useEffect(() => {
        if (!todayBookings) getBookings({ from, to, workplace })
        const interval = setInterval(() => {
            getBookings({
                from,
                to,
                workplace,
            })
        }, 60000)

        return () => clearInterval(interval)
    }, [])

    return (
        <Box width={{ md: '33.3vw', sm: '100%' }}>
            <List
                sx={{
                    width: '100%',
                    bgcolor: '#F9F9FB',
                    borderRadius: 6,
                    height: '65vh',
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
                    ? map(
                          ({ name, birthdate, start, id }) => (
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
                                          equals(format(new Date(), 'yyyy-MM-dd'), birthdate) ? '' : birthdate
                                      }
                                  />
                                  <Typography sx={{ fontWeight: 600, fontSize: '2rem' }} color="primary">
                                      {format(getDateWithCorrectOffset(start), 'HH:mm')}
                                  </Typography>
                              </ListItem>
                          ),
                          sortBy(prop('start'))(todayBookings)
                      )
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

AdministrationDashboardTodayPatients.propTypes = {}

export default AdministrationDashboardTodayPatients
