import { Hidden, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { ReactNode } from 'react'
import { Link, NavigateFunction, useNavigate } from 'react-router-dom'
import { isNilOrEmpty } from '../../../../utils'

interface AdminToolbarItems {
    id: number
    icon?: ReactNode // Assuming icons are React components
    text: string
    link?: string
    disabled?: boolean // optional property
    onClick?: (navigate: NavigateFunction) => void
    hiddenMobile?: boolean
}
type AdministrationDrawerListItemsProps = {
    isOpen: boolean
    selectedItem: number
    arrayOfItems: AdminToolbarItems[]
}
const AdministrationDrawerListItems = ({
    arrayOfItems,
    selectedItem,
    isOpen,
}: AdministrationDrawerListItemsProps) => {
    const navigate = useNavigate()
    return (
        <List disablePadding>
            {arrayOfItems.map(({ id, icon, text, link, disabled, onClick, hiddenMobile = false }) => (
                <ListItem key={text} disablePadding title={text}>
                    <Hidden smDown={hiddenMobile}>
                        <ListItemButton
                            sx={(theme) => ({
                                minHeight: 48,
                                justifyContent: isOpen ? 'initial' : 'center',
                                px: 2.5,
                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.getContrastText(theme.palette.secondary.main),
                                },
                                '&:hover, &.Mui-selected:hover': {
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.getContrastText(theme.palette.secondary.main),
                                },
                            })}
                            disabled={disabled}
                            selected={id === selectedItem}
                            onClick={() => {
                                onClick && onClick(navigate)
                            }}
                            {...(!isNilOrEmpty(link) && { to: link, component: Link })}
                        >
                            {icon && (
                                <ListItemIcon
                                    sx={(theme) => ({
                                        minWidth: 0,
                                        mr: isOpen ? 2 : 'auto',
                                        justifyContent: 'center',
                                        '& svg': {
                                            fill: theme.palette.secondary.main,
                                        },
                                    })}
                                >
                                    {icon}
                                </ListItemIcon>
                            )}
                            {isOpen && (
                                <ListItemText
                                    primary={text}
                                    sx={{
                                        fontWeight: id === selectedItem ? '700' : '400',
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </Hidden>
                </ListItem>
            ))}
        </List>
    )
}

export default AdministrationDrawerListItems
