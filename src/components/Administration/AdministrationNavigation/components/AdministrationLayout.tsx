import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import AutomaticLogoutDialog from '../../../common/AutomaticLogOutDialog'
import { SIDEBAR_WIDTH } from './AdministrationSidebar'

const AdministrationLayout = () => {
    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8f7f4',
                ml: `${SIDEBAR_WIDTH}px`,
                p: '24px 28px',
            }}
        >
            <AutomaticLogoutDialog />
            <Outlet />
        </Box>
    )
}

export default AdministrationLayout
