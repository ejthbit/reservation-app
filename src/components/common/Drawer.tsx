import { styled } from '@mui/material/styles'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import { Theme, CSSObject } from '@mui/material/styles'

export const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
    color: 'white',
    // borderRadius: '0 100px 0 0',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
    color: 'white',
    // borderRadius: '0 50px 0 0',
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
