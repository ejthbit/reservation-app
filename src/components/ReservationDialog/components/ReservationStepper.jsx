import { Step, StepContent, StepLabel, Stepper } from '@mui/material'
import { Box } from '@mui/system'
import DEFAULT_STEPS from '../constants/defaultSteps'
import getReservationContentByStep from '../helpers/getReservationContentByStep'
import PropTypes from 'prop-types'
import { reject } from 'ramda'
import { useMemo } from 'react'
import isNilOrEmpty from '../../../utils/isNilOrEmpty'
import { ReservationStepperControls } from './stepsContent'
import { useSelector } from 'react-redux'
import {
    getActiveStep,
    getLastBooking,
} from '../../../store/reservationProcess/selectors'

const mockStepsConfiguration = [
    // { label: 'Výběr ambulance', step: reservationSteps.FIRST },
    // { label: 'Preference lékaře', step: reservationSteps.SECOND },
    // { label: 'Vyberte termín své navštevy', step: reservationSteps.THIRD },
    // {
    //     label: 'Prosím vyplňte své kontaktni údaje',
    //     step: reservationSteps.FORTH,
    // },
]
const getStepsConfiguration = (
    stepsConfiguration,
    error,
    completedOk = false
) => [
    ...stepsConfiguration,
    DEFAULT_STEPS.ready,
    { ...(completedOk && DEFAULT_STEPS.completed) },
    { ...(error && DEFAULT_STEPS.error) },
]

export const ReservationStepper = ({
    stepsConfiguration = mockStepsConfiguration,
}) => {
    const activeStep = useSelector(getActiveStep) // 'COMPLETED'
    const { errors, completed } = useSelector(getLastBooking)

    const steps = useMemo(
        () =>
            reject(
                isNilOrEmpty,
                getStepsConfiguration(stepsConfiguration, errors, completed)
            ),
        [stepsConfiguration, errors, completed]
    )

    return (
        <Box
            sx={(theme) => ({
                width: '100%',
                '& .MuiPaper-root': {
                    backgroundColor: 'transparent',
                },
                [theme.breakpoints.down('md')]: {
                    '& .MuiPaper-root': {
                        padding: theme.spacing(1),
                    },
                },
            })}
        >
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map(({ label, step }) => (
                    <Step key={label}>
                        <StepLabel error={!!errors}>{label}</StepLabel>
                        <StepContent>
                            <Box>
                                {getReservationContentByStep(
                                    step,
                                    stepsConfiguration
                                )}
                            </Box>
                            <ReservationStepperControls steps={steps} />
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    )
}

ReservationStepper.propTypes = {
    stepsConfiguration: PropTypes.object,
}
export default ReservationStepper
