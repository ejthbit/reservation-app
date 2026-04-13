import { Box, Step, StepContent, StepLabel, Stepper, Theme } from '@mui/material'
import { useMemo } from 'react'
import isNilOrEmpty from '../../../../utils/isNilOrEmpty'
import DEFAULT_STEPS from '../constants/defaultSteps'
import getReservationContentByStep, { StepsConfiguration } from '../helpers/getReservationContentByStep'
import ReservationStepperControls from './stepsContent/ReservationStepperControls'
import { useReservation } from '../../../../context/Reservation'

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
        () =>
            getStepsConfiguration(stepsConfiguration, isLoading, errors, completed).filter(
                (s) => !isNilOrEmpty(s),
            ),
        [stepsConfiguration, isLoading, errors, completed],
    )
    return (
        <Box
            sx={(theme: Theme) => ({
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
            <Stepper
                activeStep={getNumberStepByName(activeStep, steps)}
                orientation="vertical"
                connector={null}
            >
                {steps.map(
                    ({ label, step }) =>
                        step && (
                            <Step key={label}>
                                <StepLabel error={!!errors}>{label}</StepLabel>
                                <StepContent sx={{ border: 'none' }}>
                                    <Box>{getReservationContentByStep(step, stepsConfiguration)}</Box>
                                </StepContent>
                            </Step>
                        ),
                )}
                <ReservationStepperControls steps={steps} />
            </Stepper>
        </Box>
    )
}

export default ReservationStepper
