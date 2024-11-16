import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { drawerWidth } from '../../../common'
import AutomaticLogoutDialog from '../../../common/AutomaticLogOutDialog'
import AdministrationPathBreadcrumbs from './AdministrationPathBreadcrumbs'

const AdministrationLayout = ({ isDrawerOpen }: { isDrawerOpen: boolean }) => {
    return (
        <Box
            component="main"
            sx={(theme) => ({
                height: `calc(100vh - 64px)`,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f9fafb',
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
            <Box
                display="flex"
                mb={3}
                alignItems="center"
                sx={(theme) => ({
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 6,
                    padding: 2,
                })}
            >
                <AdministrationPathBreadcrumbs />
                <AutomaticLogoutDialog />
            </Box>
            <Outlet />
        </Box>
    )
}

export default AdministrationLayout
