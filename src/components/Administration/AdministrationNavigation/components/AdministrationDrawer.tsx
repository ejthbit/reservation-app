import {
    DateRange,
    Event,
    Home,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    Logout,
    ManageAccounts,
    Newspaper,
    People,
    Schedule,
    Settings,
} from '@mui/icons-material'
import { Box, Fade, Typography } from '@mui/material'
import { useState } from 'react'
import packageJson from '../../../../../package.json'
import { Drawer } from '../../../common'
import AmbulanceSelect from '../../../common/AmbulanceSelect'
import AdministrationDrawerListItems from './AdministrationDrawerListItems'
import AdministrationLayout from './AdministrationLayout'

import { type NavigateFunction, useLocation } from 'react-router-dom'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { useUser } from '../../../../context/User/UserProvider'

type GetAdminToolbarToolset = {
    isDrawerOpen: boolean
    onClose: () => void
    onLogOut: () => void
}

const adminToolbarLinks = [
    { id: 0, icon: <Home />, text: 'Přehled', link: '/admin' },
    { id: 3, icon: <DateRange />, text: 'Kalendař', link: '/admin/calendar' },
    { id: 2, icon: <Schedule />, text: 'Rozpis směn', link: '/admin/services' },
    { id: 4, icon: <Newspaper />, text: 'Oznámení', link: '/admin/announcements' },
    { id: 1, icon: <Event />, text: 'Objednávky', link: '/admin/orders' },
    { id: 5, icon: <People />, text: 'Zaměstnanci', link: '/admin/employees' },
]

const getAdminToolbarToolset = ({ isDrawerOpen, onClose, onLogOut }: GetAdminToolbarToolset) => [
    { id: 6, icon: <Settings />, text: 'Nastavení', link: '/admin/settings' },
    {
        id: 7,
        icon: isDrawerOpen ? <KeyboardArrowLeft /> : <KeyboardArrowRight />,
        text: 'Skrýt panel',
        onClick: async () => {
            onClose()
        },
        hiddenMobile: true,
    },
    {
        id: 8,
        icon: <Logout />,
        text: 'Odhlásit se',
        onClick: async (navigate: NavigateFunction) => {
            onLogOut()
            navigate('/login')
        },
    },
    {
        id: 9,
        text: `v${packageJson.version}`,
        disabled: true,
    },
]

const AdministrationDrawer = () => {
    const { name, logOut, userRole } = useUser()
    const { selectWorkspace, selectedWorkspace } = useAdministration()
    const [isDrawerOpen, toggleDrawer] = useState(false)
    const location = useLocation()

    const navLinks = [
        ...adminToolbarLinks,
        ...(userRole === 'admin'
            ? [{ id: 10, icon: <ManageAccounts />, text: 'Uživatelé', link: '/admin/users' }]
            : []),
    ]

    const allItems = [
        ...navLinks,
        ...getAdminToolbarToolset({
            isDrawerOpen,
            onClose: () => toggleDrawer((prevState) => !prevState),
            onLogOut: logOut,
        }),
    ]
    const selectedItem =
        allItems.find(({ link }) => link && location.pathname === link)?.id ??
        allItems.find(({ link }) => link && link !== '/admin' && location.pathname.startsWith(link))?.id ??
        0

    return (
        <>
            <Box
                sx={{
                    background: `#5A2EC4`,
                    color: 'white',
                    position: 'sticky',
                    top: 0,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                component="div"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
                gap={2}
            >
                <Typography ml={2}>
                    Vítejte, <span style={{ fontWeight: 600 }}>{name}</span>
                </Typography>
                <AmbulanceSelect
                    selectedValueId={selectedWorkspace}
                    onAmbulanceSelect={(e) => selectWorkspace(e.target.value as string)}
                    sx={{
                        color: 'white',
                        '& .MuiSelect-icon': { color: 'white' },
                        '&::before, &::after': { borderColor: 'white' },
                    }}
                />
            </Box>
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
                            arrayOfItems={navLinks}
                            isOpen={isDrawerOpen}
                            selectedItem={selectedItem}
                        />
                        <AdministrationDrawerListItems
                            arrayOfItems={getAdminToolbarToolset({
                                isDrawerOpen,
                                onClose: () => toggleDrawer((prevState) => !prevState),
                                onLogOut: logOut,
                            })}
                            isOpen={isDrawerOpen}
                            selectedItem={selectedItem}
                        />
                    </Box>
                </Drawer>
            </Fade>
            <AdministrationLayout isDrawerOpen={isDrawerOpen} />
        </>
    )
}

export default AdministrationDrawer
