import { Box, DialogTitle, IconButton, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import PropTypes from 'prop-types'

const ReservationDialogTitle = ({ onClose }) => {
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
                    {
                        <Typography variant="h4" fontWeight="bold">
                            Rezervační formulář
                        </Typography>
                    }
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

ReservationDialogTitle.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export default ReservationDialogTitle
