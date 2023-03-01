import { Box, Dialog, DialogContent } from '@mui/material'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { store } from '../../../store/store'
import {
    ReservationDialogTitle,
    ReservationBackdropMessage,
    ReservationDialogActions,
    ReservationStepper,
} from './components'
import { withTheme } from '../../../hoc'
const ReservationDialog = ({ isOpen, onClose, stepsConfiguration }) => {
    return (
        <Provider store={store}>
            {isOpen && (
                <Box>
                    <ReservationBackdropMessage />
                    <Dialog maxWidth="md" open={isOpen} onClose={onClose} fullWidth>
                        <ReservationDialogTitle onClose={onClose} />
                        <DialogContent>
                            <ReservationStepper stepsConfiguration={stepsConfiguration} />
                        </DialogContent>
                        <ReservationDialogActions onClose={onClose} />
                    </Dialog>
                </Box>
            )}
        </Provider>
    )
}

ReservationDialog.propTypes = {
    stepsConfiguration: PropTypes.array.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
}

export default withTheme(ReservationDialog)
