import { Box } from '@mui/material'
import React from 'react'
import AdministrationDrawer from './AdministrationDrawer'

const AdministrationTopbar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AdministrationDrawer />
        </Box>
    )
}

export default AdministrationTopbar
