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
import { map, prop, sortBy } from 'ramda'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserConfigurationSelectedAmbulance } from '../../../../store/administration'
import { useGetBookingsQuery, useLazyGetBookingsQuery } from '../../../../store/administration/services'
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

    // TODO: next 60/INTERVAL e.g.: 15 min interval = 4 appointments to fetch or 6 if interval is 10.
    // TODO: Sort by start
    return (
        <Box width={{ md: '33.3vw', sm: '100%' }}>
            <List
                sx={(theme) => ({
                    width: '100%',
                    bgcolor: '#F9F9FB',
                    borderRadius: 2,
                    height: '65vh',
                })}
            >
                <Typography sx={{ mb: 1, ml: 3, mt: 1 }} variant="h6" fontWeight="600">
                    Dnešní objednávky
                </Typography>
                {isNilOrEmpty(todayBookings) && (
                    <Box display="flex" alignItems="center" justifyContent="center" height="80%">
                        <Typography>Nemáta žádné následující objednávky.</Typography>
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
                                  <ListItemText sx={{ width: '30%' }} primary={name} secondary={birthdate} />
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
