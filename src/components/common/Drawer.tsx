import { styled } from '@mui/material/styles'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import { Theme, CSSObject } from '@mui/material/styles'

export const drawerWidth = 240

const headerHeight = 64

const openedMixin = (theme: Theme): CSSObject => ({
    color: 'white',
    width: drawerWidth,
    top: headerHeight,
    height: `calc(100% - ${headerHeight}px)`,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    background: `linear-gradient(to bottom, #5A2EC4, #311B92)`,
    border: 'none',
    overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
    color: 'white',
    top: headerHeight,
    height: `calc(100% - ${headerHeight}px)`,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    background: `linear-gradient(to bottom, #5A2EC4, #311B92)`,
    border: 'none',
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
})

interface CustomDrawerProps extends DrawerProps {
    open: boolean
}

export const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})<CustomDrawerProps>(({ theme, open }: { theme: Theme; open: boolean }) => {
    const styles: CSSObject = {
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
    }

    return styles
})
