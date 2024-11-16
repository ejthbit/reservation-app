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
import { Box, Fade, Typography } from '@mui/material'
import { ReactNode, useState } from 'react'
import packageJson from '../../../../../package.json'
import { isMobile } from '../../../../utils'
import { Drawer } from '../../../common'
import AmbulanceSelect from '../../../common/AmbulanceSelect'
import AdministrationDrawerListItems from './AdministrationDrawerListItems'
import AdministrationLayout from './AdministrationLayout'

import { type NavigateFunction } from 'react-router-dom'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { useUser } from '../../../../context/User/UserProvider'

type GetAdminToolbarToolset = {
    isDrawerOpen: boolean
    onClose: (value: boolean) => void
    onLogOut: () => void
}

const adminToolbarLinks = [
    { id: 0, icon: <Home />, text: 'Přehled', link: '/admin' },
    { id: 1, icon: <Event />, text: 'Objednávky', link: '/admin/orders' },
    { id: 2, icon: <Schedule />, text: 'Rozpis směn', link: '/admin/services' },
    { id: 3, icon: <DateRange />, text: 'Kalendař', link: '/admin/calendar' },
    { id: 4, icon: <Newspaper />, text: 'Oznámení', link: '/admin/announcements' },
    { id: 5, icon: <People />, text: 'Zaměstnanci', link: '/admin/employees', disabled: true },
]

const getAdminToolbarToolset = ({ isDrawerOpen, onClose, onLogOut }: GetAdminToolbarToolset) => [
    { id: 6, icon: <Settings />, text: 'Nastavení', link: '/admin/settings' },
    {
        id: 7,
        icon: isDrawerOpen ? <KeyboardArrowLeft /> : <KeyboardArrowRight />,
        text: 'Skrýt panel',
        onClick: onClose,
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
    const { name, logOut } = useUser()
    const { selectWorkspace, selectedWorkspace } = useAdministration()
    const [isDrawerOpen, toggleDrawer] = useState(isMobile ? false : true)
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
                            arrayOfItems={getAdminToolbarToolset({
                                isDrawerOpen,
                                onClose: () => toggleDrawer((prevState) => !prevState),
                                onLogOut: logOut,
                            })}
                            isOpen={isDrawerOpen}
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                        />
                    </Box>
                </Drawer>
            </Fade>
            <Box
                component="div"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                padding={2}
                bgcolor="white"
                gap={2}
            >
                <AmbulanceSelect
                    // sx={{ width: '40%', variant: '' }}
                    selectedValueId={selectedWorkspace}
                    onAmbulanceSelect={(e) => selectWorkspace(e.target.value as string)}
                />
                <Typography>
                    Vítejte, <span style={{ fontWeight: 600 }}>{name}</span>
                </Typography>
            </Box>
            <AdministrationLayout isDrawerOpen={isDrawerOpen} />
        </>
    )
}

export default AdministrationDrawer
