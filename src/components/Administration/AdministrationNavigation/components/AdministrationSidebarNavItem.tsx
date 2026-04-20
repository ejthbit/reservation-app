import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface AdministrationSidebarNavItemProps {
    icon: ReactNode
    text: string
    link: string
    exact?: boolean
    badge?: ReactNode
}

const AdministrationSidebarNavItem = ({
    icon,
    text,
    link,
    exact = false,
    badge,
}: AdministrationSidebarNavItemProps) => {
    const location = useLocation()
    const isActive = exact ? location.pathname === link : location.pathname.startsWith(link)

    return (
        <ListItem disablePadding>
            <ListItemButton
                component={Link}
                to={link}
                selected={isActive}
                sx={(theme) => ({
                    borderRadius: '8px',
                    mx: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.getContrastText(theme.palette.primary.main),
                        '& .MuiListItemIcon-root': {
                            color: theme.palette.getContrastText(theme.palette.primary.main),
                        },
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: theme.palette.primary.light,
                    },
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                })}
            >
                <ListItemIcon
                    sx={(theme) => ({
                        minWidth: 36,
                        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    })}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 400,
                    }}
                />
                {badge && <Box sx={{ ml: 'auto' }}>{badge}</Box>}
            </ListItemButton>
        </ListItem>
    )
}

export default AdministrationSidebarNavItem
