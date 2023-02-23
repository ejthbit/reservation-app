import PropTypes from 'prop-types'
import { Box, Hidden, Typography } from '@mui/material'
import { drawerWidth } from './AdministrationDrawer'
import { Outlet } from 'react-router-dom'
import AdministrationPathBreadcrumbs from './AdministrationPathBreadcrumbs'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'

const AdministrationLayout = ({ isDrawerOpen }) => {
    return (
        <Box
            component="main"
            sx={(theme) => ({
                height: `calc(100vh - 64px)`,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFF',
                ml: isDrawerOpen ? `${drawerWidth}px` : 7,
                flexGrow: 1,
                p: 6,
                pt: 3,
                transition: !isDrawerOpen
                    ? theme.transitions.create('margin', {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.enteringScreen,
                      })
                    : theme.transitions.create('margin', {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.leavingScreen,
                      }),
            })}
        >
            <Box display="flex" mb={3}>
                <AdministrationPathBreadcrumbs />
                <Hidden smDown>
                    <Typography sx={{ color: '#000' }}>
                        {format(new Date(), 'PPPP HH:mm', { locale: cs })}
                    </Typography>
                </Hidden>
            </Box>
            <Outlet />
        </Box>
    )
}

AdministrationLayout.propTypes = {
    isDrawerOpen: PropTypes.bool.isRequired,
}

export default AdministrationLayout
