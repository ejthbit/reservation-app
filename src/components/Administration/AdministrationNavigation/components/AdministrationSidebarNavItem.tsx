import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface AdministrationSidebarNavItemProps {
    icon: ReactNode
    text: string
    link: string
    exact?: boolean
    badge?: ReactNode
    iconOnly?: boolean
}

const AdministrationSidebarNavItem = ({
    icon,
    text,
    link,
    exact = false,
    badge,
    iconOnly = false,
}: AdministrationSidebarNavItemProps) => {
    const location = useLocation()
    const isActive = exact ? location.pathname === link : location.pathname.startsWith(link)

    return (
        <ListItem disablePadding>
            <ListItemButton
                component={Link}
                to={link}
                selected={isActive}
                title={iconOnly ? text : undefined}
                sx={(theme) => ({
                    borderRadius: '8px',
                    mx: 0.5,
                    mb: 0.5,
                    justifyContent: iconOnly ? 'center' : 'flex-start',
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
                        minWidth: iconOnly ? 0 : 36,
                        justifyContent: 'center',
                        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    })}
                >
                    {icon}
                </ListItemIcon>
                {!iconOnly && (
                    <ListItemText
                        primary={text}
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: isActive ? 600 : 400,
                        }}
                    />
                )}
                {!iconOnly && badge && <Box sx={{ ml: 'auto' }}>{badge}</Box>}
            </ListItemButton>
        </ListItem>
    )
}

export default AdministrationSidebarNavItem
