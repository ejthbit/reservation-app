import { AccountCircle, Close as CloseIcon, Menu as MenuIcon } from '@mui/icons-material'
import { AppBar, Box, IconButton, Menu, MenuItem, Slide, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { getUserInfo } from '../../../../store/userInfo'
import { logOut } from '../../../../store/userInfo/userInfoSlice'
import AdministrationDrawer from './AdministrationDrawer'

const AdministrationTopbar = () => {
    const { id, email, name } = useSelector(getUserInfo)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [isDrawerOpen, toggleDrawer] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleLogout = async () => {
        localStorage.clear()
        await dispatch(logOut())
        navigate('/login')
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Slide direction="down" in timeout={{ enter: 400 }}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
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
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Administrace
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="center"
                            onClick={handleMenu}
                            sx={{
                                cursor: 'pointer',
                                ':hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            {name}
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </Box>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem disabled>ID: {id}</MenuItem>
                            <MenuItem onClick={handleClose}>Můj účet</MenuItem>
                            <MenuItem onClick={handleLogout}>Odhlásit se</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Slide>
            <AdministrationDrawer isOpen={isDrawerOpen} />
        </Box>
    )
}

AdministrationTopbar.propTypes = {}

export default AdministrationTopbar
