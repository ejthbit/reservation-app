import { Close as CloseIcon, Menu as MenuIcon } from '@mui/icons-material'
import { AppBar, Box, Breadcrumbs, Fade, Hidden, IconButton, Toolbar, Typography } from '@mui/material'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { isMobile } from '../../../../utils'
import AdministrationDrawer from './AdministrationDrawer'

const AdministrationTopbar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AdministrationDrawer />
        </Box>
    )
}

export default AdministrationTopbar
