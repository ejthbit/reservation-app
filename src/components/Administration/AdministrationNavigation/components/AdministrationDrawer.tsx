import { Box } from '@mui/material'
import AdministrationLayout from './AdministrationLayout'
import AdministrationSidebar from './AdministrationSidebar'

const AdministrationDrawer = () => {
    return (
        <Box>
            <AdministrationSidebar />
            <AdministrationLayout />
        </Box>
    )
}

export default AdministrationDrawer
