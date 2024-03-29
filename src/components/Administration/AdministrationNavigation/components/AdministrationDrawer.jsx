import {
    DateRange,
    Event,
    Home,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    Logout,
    Newspaper,
    People,
    Schedule,
    Settings,
} from '@mui/icons-material'
import { Box, Fade, ListItemText, Typography, styled } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { useState } from 'react'
import { logOut } from '../../../../store/userInfo/userInfoSlice'
import AdministrationDrawerListItems from './AdministrationDrawerListItems'
import AdministrationLayout from './AdministrationLayout'
import packageJson from '../../../../../package.json'
const adminToolbarLinks = [
    { id: 0, icon: <Home />, text: 'Přehled', link: '/admin' },
    { id: 1, icon: <Event />, text: 'Objednávky', link: '/admin/orders' },
    { id: 2, icon: <Schedule />, text: 'Rozpis směn', link: '/admin/services' },
    { id: 3, icon: <DateRange />, text: 'Kalendař', link: '/admin/calendar' },
    { id: 4, icon: <Newspaper />, text: 'Aktuality', link: '/admin/announcements' },
    { id: 5, icon: <People />, text: 'Zaměstnanci', link: '/admin/employees', disabled: true },
]
const getAdminToolbarToolset = (isOpen, onClose) => [
    { id: 6, icon: <Settings />, text: 'Nastavení', link: '/admin/settings', disabled: true },
    {
        id: 7,
        icon: isOpen ? <KeyboardArrowLeft /> : <KeyboardArrowRight />,
        text: 'Skrýt panel',
        onClick: onClose,
        hiddenMobile: true,
    },
    {
        id: 8,
        icon: <Logout />,
        text: 'Odhlásit se',
        onClick: async (dispatch, navigate) => {
            localStorage.clear()
            await dispatch(logOut())
            navigate('/login')
        },
    },
    {
        id: 9,
        text: `v${packageJson.version}`,
        disabled: true,
    },
]

export const drawerWidth = 240

const openedMixin = (theme) => ({
    color: 'white',
    borderRadius: '0 100px 0 0',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    overflowX: 'hidden',
})

const closedMixin = (theme) => ({
    color: 'white',
    borderRadius: '0 50px 0 0',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
})
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}))

const AdministrationDrawer = () => {
    const [isDrawerOpen, toggleDrawer] = useState(true)
    const [selectedItem, setSelectedItem] = useState(0)

    return (
        <>
            <Fade in timeout={{ enter: 400 }}>
                <Drawer variant="permanent" open={isDrawerOpen} anchor="left">
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <AdministrationDrawerListItems
                            arrayOfItems={adminToolbarLinks}
                            isOpen={isDrawerOpen}
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                        />
                        <AdministrationDrawerListItems
                            arrayOfItems={getAdminToolbarToolset(isDrawerOpen, () =>
                                toggleDrawer((prevState) => !prevState)
                            )}
                            isOpen={isDrawerOpen}
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                        />
                    </Box>
                </Drawer>
            </Fade>
            <AdministrationLayout isDrawerOpen={isDrawerOpen} />
        </>
    )
}

export default AdministrationDrawer
