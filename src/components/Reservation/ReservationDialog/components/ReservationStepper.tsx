import { Step, StepContent, StepLabel, Stepper } from '@mui/material'
import { Box } from '@mui/system'
import PropTypes from 'prop-types'
import { reject } from 'ramda'
import { useMemo } from 'react'
import { useReservation } from 'src/context/Reservation'
import isNilOrEmpty from '../../../../utils/isNilOrEmpty'
import DEFAULT_STEPS from '../constants/defaultSteps'
import getReservationContentByStep, { StepsConfiguration } from '../helpers/getReservationContentByStep'
import ReservationStepperControls from './stepsContent/ReservationStepperControls'

const getNumberStepByName = (name: string, steps: StepsConfiguration) => {
    const numberOfSteps = steps.length
    switch (name) {
        case 'COMPLETED':
        case 'READY':
        case 'ERROR':
            return numberOfSteps - 1
        default:
            return steps.findIndex((step) => step.step === name)
    }
}
const getStepsConfiguration = (
    stepsConfiguration: StepsConfiguration,
    loading: boolean,
    error: Error | undefined,
    completedOk = false,
) => [
    ...stepsConfiguration,
    DEFAULT_STEPS.ready,
    { ...(loading && DEFAULT_STEPS.default) },
    { ...(completedOk && DEFAULT_STEPS.completed) },
    { ...(error && DEFAULT_STEPS.error) },
]

export const ReservationStepper = ({ stepsConfiguration }: { stepsConfiguration: StepsConfiguration }) => {
    const {
        activeStep,
        lastBooking: { errors, completed, isLoading },
    } = useReservation()

    const steps = useMemo(
        () => reject(isNilOrEmpty, getStepsConfiguration(stepsConfiguration, isLoading, errors, completed)),
        [stepsConfiguration, isLoading, errors, completed],
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
            <Stepper activeStep={getNumberStepByName(activeStep, steps)} orientation="vertical">
                {steps.map(
                    ({ label, step }) =>
                        step && (
                            <Step key={label}>
                                <StepLabel error={!!errors}>{label}</StepLabel>
                                <StepContent>
                                    <Box>{getReservationContentByStep(step, stepsConfiguration)}</Box>
                                    <ReservationStepperControls steps={steps} />
                                </StepContent>
                            </Step>
                        ),
                )}
            </Stepper>
        </Box>
    )
}

ReservationStepper.propTypes = {
    stepsConfiguration: PropTypes.array,
}
export default ReservationStepper
