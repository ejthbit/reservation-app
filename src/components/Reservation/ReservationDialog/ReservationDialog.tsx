import { Box, Dialog, DialogContent } from '@mui/material'
import { ReservationProvider } from 'src/context/Reservation'
import { withTheme } from '../../../hoc'
import defaultStepsConfiguration from '../defaultStepsConfiguration'
import {
    ReservationBackdropMessage,
    ReservationDialogActions,
    ReservationDialogTitle,
    ReservationStepper,
} from './components'

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
                    <Dialog maxWidth="md" open={isOpen} onClose={onClose} fullWidth>
                        <ReservationDialogTitle onClose={onClose} />
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
