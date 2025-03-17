import { Box, Dialog, DialogContent, Divider } from '@mui/material'
import { withTheme } from '../../../hoc'
import defaultStepsConfiguration from '../defaultStepsConfiguration'
import {
    ReservationBackdropMessage,
    ReservationDialogActions,
    ReservationDialogTitle,
    ReservationStepper,
} from './components'
import { ReservationProvider } from '../../../context/Reservation'

type ReservationDialogProps = {
    isOpen: boolean
    onClose: () => void
    stepsConfiguration: {
        label: string
        component: JSX.Element
        step: string
    }[]
}
const ReservationDialog = ({
    isOpen,
    onClose,
    stepsConfiguration = defaultStepsConfiguration,
}: ReservationDialogProps) => {
    return (
        <ReservationProvider>
            {isOpen && (
                <Box>
                    <ReservationBackdropMessage />
                    <Dialog
                        maxWidth="md"
                        open={isOpen}
                        onClose={onClose}
                        fullWidth
                        PaperProps={{ sx: { borderRadius: '1rem' } }}
                    >
                        <ReservationDialogTitle onClose={onClose} />
                        <Divider />
                        <DialogContent>
                            <ReservationStepper stepsConfiguration={stepsConfiguration} />
                        </DialogContent>
                        <ReservationDialogActions onClose={onClose} />
                    </Dialog>
                </Box>
            )}
        </ReservationProvider>
    )
}

export default withTheme(ReservationDialog)
