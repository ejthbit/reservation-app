import { Box, DialogTitle, IconButton, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'

const ReservationDialogTitle = ({ onClose }: { onClose: () => void }) => {
    return (
        <DialogTitle
            sx={(theme) => ({
                paddingBottom: 0,
                '& svg': {
                    width: theme.spacing(4),
                    height: theme.spacing(4),
                },
            })}
        >
            <Box display="flex" alignItems="center" justifyContent="center">
                <Box flexGrow={1}>
                    <Typography variant="h6" fontWeight="bold">
                        Rezervační formulář
                    </Typography>
                </Box>
                <Box alignSelf="flex-start">
                    <IconButton onClick={onClose} size="large">
                        <Close />
                    </IconButton>
                </Box>
            </Box>
        </DialogTitle>
    )
}

export default ReservationDialogTitle
