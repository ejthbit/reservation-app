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
            {/* <Fade in timeout={{ enter: 500 }}>
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    elevation={0}
                >
                    <Toolbar>
                        <Hidden smDown>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={() => toggleDrawer((prevState) => !prevState)}
                            >
                                {!isDrawerOpen ? <MenuIcon /> : <CloseIcon />}
                            </IconButton>
                        </Hidden>
                    </Toolbar>
                </AppBar>
            </Fade> */}
            <AdministrationDrawer />
        </Box>
    )
}

export default AdministrationTopbar
