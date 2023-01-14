import { Box, Dialog, DialogContent } from '@mui/material'
import PropTypes from 'prop-types'
import {
    ReservationDialogTitle,
    ReservationBackdropMessage,
    ReservationDialogActions,
    ReservationStepper,
} from './components'
const ReservationDialog = ({ isOpen, onClose }) => {
    return (
        isOpen && (
            <Box>
                <ReservationBackdropMessage />
                <Dialog maxWidth="md" open={isOpen} onClose={onClose} fullWidth>
                    <ReservationDialogTitle onClose={onClose} />
                    <DialogContent>
                        <ReservationStepper />
                    </DialogContent>
                    <ReservationDialogActions onClose={onClose} />
                </Dialog>
            </Box>
        )
    )
}

ReservationDialog.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
}

export default ReservationDialog
