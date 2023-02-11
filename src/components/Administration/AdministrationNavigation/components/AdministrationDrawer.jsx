import { DateRange, Event, Home, People, Schedule } from '@mui/icons-material'
import {
    Box,
    Fade,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    Toolbar,
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { equals, map } from 'ramda'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdministrationLayout from './AdministrationLayout'

const adminToolbarContent = [
    { id: 0, icon: <Home />, text: 'Home', link: '/admin' },
    { id: 1, icon: <Event />, text: 'Objednávky', link: '/admin/orders' },
    { id: 2, icon: <Schedule />, text: 'Rozpis směn', link: '/admin/services' },
    { id: 3, icon: <DateRange />, text: 'Kalendař', link: '/admin/calendar' },
    { id: 4, icon: <People />, text: 'Zaměstnanci', link: '/admin/employees', disabled: true },
]

export const drawerWidth = 240

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
})

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
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

const AdministrationDrawer = ({ isOpen }) => {
    const [selectedItem, setSelectedItem] = useState('Administrace')
    return (
        <>
            <Fade in timeout={{ enter: 1000 }}>
                <Drawer variant="permanent" open={isOpen} anchor="left">
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List disablePadding>
                            {map(
                                ({ id, icon, text, link, disabled }) => (
                                    <ListItem key={text} disablePadding title={text}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: isOpen ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                            disabled={disabled}
                                            selected={equals(id, selectedItem)}
                                            component={Link}
                                            to={link}
                                            onClick={() => setSelectedItem(id)}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: isOpen ? 3 : 'auto',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText sx={{ opacity: isOpen ? 1 : 0 }} primary={text} />
                                        </ListItemButton>
                                    </ListItem>
                                ),
                                adminToolbarContent
                            )}
                        </List>
                    </Box>
                </Drawer>
            </Fade>
            <AdministrationLayout isDrawerOpen={isOpen} />
        </>
    )
}

AdministrationDrawer.propTypes = {}

export default AdministrationDrawer
