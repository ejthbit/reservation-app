import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { getUserConfigurationSelectedAmbulance } from '../../../../store/administration'
import { setUserConfigurationProperty } from '../../../../store/administration/administrationSlice'
import { getUserInfo } from '../../../../store/userInfo'
import { AmbulanceSelect } from '../../../common'
import AutomaticLogoutDialog from '../../../common/AutomaticLogOutDialog'
import { drawerWidth } from './AdministrationDrawer'
import AdministrationPathBreadcrumbs from './AdministrationPathBreadcrumbs'

const AdministrationLayout = ({ isDrawerOpen }) => {
    const selectedAmbulanceId = useSelector(
        (state) => getUserConfigurationSelectedAmbulance(state) ?? getUserInfo(state)?.default_workplace
    )
    const dispatch = useDispatch()
    return (
        <Box
            component="main"
            sx={(theme) => ({
                height: `calc(100vh - 64px)`,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFF',
                ml: isDrawerOpen ? `${drawerWidth}px` : 7,
                flexGrow: 1,
                p: 6,
                pt: 3,
                transition: !isDrawerOpen
                    ? theme.transitions.create('margin', {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.enteringScreen,
                      })
                    : theme.transitions.create('margin', {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.leavingScreen,
                      }),
            })}
        >
            <Box display="flex" mb={3} alignItems="center">
                <AdministrationPathBreadcrumbs />
                <AmbulanceSelect
                    sx={{ width: '40%', variant: '' }}
                    selectedValueId={selectedAmbulanceId}
                    onAmbulanceSelect={(e) =>
                        dispatch(
                            setUserConfigurationProperty({
                                property: 'selectedAmbulance',
                                value: e.target.value,
                            })
                        )
                    }
                />
                <AutomaticLogoutDialog />
            </Box>
            <Outlet />
        </Box>
    )
}

AdministrationLayout.propTypes = {
    isDrawerOpen: PropTypes.bool.isRequired,
}

export default AdministrationLayout
