import {
    BeachAccess,
    DateRange,
    Home,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    Logout,
    ManageAccounts,
    Newspaper,
    People,
    Schedule,
} from '@mui/icons-material'
import { Box, Fade } from '@mui/material'
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
    { id: 11, icon: <BeachAccess />, text: 'Dovolená', link: '/admin/vacation' },
    { id: 4, icon: <Newspaper />, text: 'Oznámení', link: '/admin/announcements' },
    { id: 5, icon: <People />, text: 'Zaměstnanci', link: '/admin/employees' },
]

const getAdminToolbarToolset = ({ isDrawerOpen, onClose, onLogOut }: GetAdminToolbarToolset) => [
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
    const { logOut, userRole } = useUser()
    const { selectWorkspace, selectedWorkspace } = useAdministration()
    const [isDrawerOpen, toggleDrawer] = useState(true)
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
        allItems.find((item) => 'link' in item && item.link && location.pathname === item.link)?.id ??
        allItems.find((item) => 'link' in item && item.link && item.link !== '/admin' && location.pathname.startsWith(item.link))?.id ??
        0

    return (
        <Box sx={{ backgroundColor: '#f9fafb' }}>
            <Fade in timeout={{ enter: 400 }}>
                <Drawer variant="permanent" open={isDrawerOpen} anchor="left">
                    {isDrawerOpen && (
                        <Box padding={2}>
                            <AmbulanceSelect
                                variant="outlined"
                                selectedValueId={selectedWorkspace}
                                onAmbulanceSelect={(e) => selectWorkspace(e.target.value as string)}
                                sx={(theme) => ({
                                    color: theme.palette.secondary.main,
                                    '& .MuiSelect-icon': { color: theme.palette.secondary.main },
                                    '&::before, &::after': { borderColor: theme.palette.secondary.main },
                                })}
                            />
                        </Box>
                    )}
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
        </Box>
    )
}

export default AdministrationDrawer
