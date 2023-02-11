import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { drawerWidth } from './AdministrationDrawer'
import { Outlet } from 'react-router-dom'

const AdministrationLayout = ({ isDrawerOpen }) => {
    return (
        <Box
            component="main"
            sx={(theme) => ({
                height: `calc(100vh - 64px)`,
                display: 'flex',
                justifyContent: 'center',
                ml: isDrawerOpen ? `${drawerWidth}px` : 7,
                mt: 8,
                flexGrow: 1,
                p: 3,
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
            <Outlet />
        </Box>
    )
}

AdministrationLayout.propTypes = {
    isDrawerOpen: PropTypes.bool.isRequired,
}

export default AdministrationLayout
