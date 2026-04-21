import {
    BeachAccess,
    DateRange,
    Home,
    Logout,
    ManageAccounts,
    Newspaper,
    People,
    Schedule,
} from '@mui/icons-material'
import { Avatar, Box, Divider, IconButton, List, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { useUser } from '../../../../context/User/UserProvider'
import { isMobile } from '../../../../utils'
import AmbulanceSelect from '../../../common/AmbulanceSelect'
import AdministrationSidebarNavItem from './AdministrationSidebarNavItem'

export const SIDEBAR_WIDTH = 232
export const MOBILE_SIDEBAR_WIDTH = 56

const mainNavLinks = [
    { icon: <Home fontSize="small" />, text: 'Přehled', link: '/admin', exact: true },
    { icon: <DateRange fontSize="small" />, text: 'Kalendář', link: '/admin/calendar' },
    { icon: <Schedule fontSize="small" />, text: 'Rozpis směn', link: '/admin/services' },
    { icon: <BeachAccess fontSize="small" />, text: 'Dovolená', link: '/admin/vacation' },
    { icon: <Newspaper fontSize="small" />, text: 'Oznámení', link: '/admin/announcements' },
]

const managementNavLinks = [
    { icon: <People fontSize="small" />, text: 'Zaměstnanci', link: '/admin/employees' },
]

const AdministrationSidebar = () => {
    const { logOut, userRole, name, email } = useUser()
    const { selectWorkspace, selectedWorkspace } = useAdministration()
    const navigate = useNavigate()

    const initials = name
        ? name
              .split(' ')
              .map((part: string) => part[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : email?.[0]?.toUpperCase() ?? '?'

    const roleLabel = userRole === 'admin' ? 'Administrátor' : 'Uživatel'

    const sidebarWidth = isMobile ? MOBILE_SIDEBAR_WIDTH : SIDEBAR_WIDTH

    return (
        <Box
            sx={{
                width: sidebarWidth,
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                paddingRight: 1,
                paddingLeft: 1,
                zIndex: (theme) => theme.zIndex.drawer,
            }}
        >
            {!isMobile && (
                <Box sx={{ p: 2, pb: 1 }}>
                    <AmbulanceSelect
                        variant="outlined"
                        selectedValueId={selectedWorkspace}
                        onAmbulanceSelect={(e) => selectWorkspace(e.target.value as string)}
                        sx={{ width: '100%' }}
                    />
                </Box>
            )}

            <Box sx={{ flex: 1, overflow: 'auto', pt: 1 }}>
                {!isMobile && (
                    <Typography
                        variant="caption"
                        sx={{
                            px: 2,
                            py: 0.5,
                            display: 'block',
                            color: 'text.secondary',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            fontSize: 11,
                        }}
                    >
                        HLAVNÍ
                    </Typography>
                )}
                <List disablePadding>
                    {mainNavLinks.map((item) => (
                        <AdministrationSidebarNavItem
                            key={item.link}
                            icon={item.icon}
                            text={item.text}
                            link={item.link}
                            exact={item.exact}
                            iconOnly={isMobile}
                        />
                    ))}
                </List>

                {!isMobile && (
                    <Typography
                        variant="caption"
                        sx={{
                            px: 2,
                            py: 0.5,
                            mt: 1,
                            display: 'block',
                            color: 'text.secondary',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            fontSize: 11,
                        }}
                    >
                        SPRÁVA
                    </Typography>
                )}
                <List disablePadding>
                    {managementNavLinks.map((item) => (
                        <AdministrationSidebarNavItem
                            key={item.link}
                            icon={item.icon}
                            text={item.text}
                            link={item.link}
                            iconOnly={isMobile}
                        />
                    ))}
                    {userRole === 'admin' && (
                        <AdministrationSidebarNavItem
                            icon={<ManageAccounts fontSize="small" />}
                            text="Uživatelé"
                            link="/admin/users"
                            iconOnly={isMobile}
                        />
                    )}
                </List>
            </Box>

            <Divider />
            <Box
                sx={{
                    p: isMobile ? 1 : 2,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Avatar
                    sx={(theme) => ({
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.primary.main,
                        fontSize: 13,
                        fontWeight: 600,
                    })}
                >
                    {initials}
                </Avatar>
                {!isMobile && (
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                lineHeight: 1.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {name ?? email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {roleLabel}
                        </Typography>
                    </Box>
                )}
                <IconButton
                    size="small"
                    title="Odhlásit se"
                    onClick={() => {
                        logOut()
                        navigate('/login')
                    }}
                >
                    <Logout fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    )
}

export default AdministrationSidebar
