import { Apartment } from '@mui/icons-material'
import { Box, Dialog, DialogContent, DialogTitle, Fab } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { isMobile } from '../../../../utils'
import AmbulanceSelect from '../../../common/AmbulanceSelect'
import { MOBILE_SIDEBAR_WIDTH, SIDEBAR_WIDTH } from './AdministrationSidebar'

const AdministrationLayout = () => {
    const sidebarWidth = isMobile ? MOBILE_SIDEBAR_WIDTH : SIDEBAR_WIDTH
    const { selectWorkspace, selectedWorkspace } = useAdministration()
    const [open, setOpen] = useState(false)

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8f7f4',
                ml: `${sidebarWidth}px`,
                p: isMobile ? '8px 10px' : '24px 28px',
            }}
        >
            <Outlet />
            {isMobile && (
                <>
                    <Fab
                        size="small"
                        color="primary"
                        onClick={() => setOpen(true)}
                        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1200 }}
                    >
                        <Apartment fontSize="small" />
                    </Fab>
                    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                        <DialogTitle sx={{ pb: 1 }}>Vyberte pracoviště</DialogTitle>
                        <DialogContent>
                            <AmbulanceSelect
                                variant="outlined"
                                selectedValueId={selectedWorkspace}
                                onAmbulanceSelect={(e) => {
                                    selectWorkspace(e.target.value as string)
                                    setOpen(false)
                                }}
                                sx={{ width: '100%' }}
                            />
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </Box>
    )
}

export default AdministrationLayout
