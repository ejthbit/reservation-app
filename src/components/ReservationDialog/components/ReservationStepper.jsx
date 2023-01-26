import { Step, StepContent, StepLabel, Stepper } from '@mui/material'
import { Box } from '@mui/system'
import DEFAULT_STEPS from '../constants/defaultSteps'
import getReservationContentByStep from '../helpers/getReservationContentByStep'
import PropTypes from 'prop-types'
import { findIndex, propEq, reject } from 'ramda'
import { useMemo } from 'react'
import isNilOrEmpty from '../../../utils/isNilOrEmpty'
import { ReservationStepperControls } from './stepsContent'
import { useSelector } from 'react-redux'
import { getActiveStep, getLastBooking } from '../../../store/reservationProcess/selectors'
import { ReservationAmbulanceSelect, ReservationDoctorSelect } from '../../ReservationControls/'
import ReservationTermPicker from '../../ReservationControls/ReservationTermPicker/ReservationTermPicker'
const mockStepsConfiguration = [
    {
        label: 'Výběr ambulance',
        component: <ReservationAmbulanceSelect step={'FIRST'} />,
        step: 'FIRST',
    },
    {
        label: 'Preference lékaře',
        component: <ReservationDoctorSelect />,
        step: 'SECOND',
    },
    {
        label: 'Vyberte termín své navštevy',
        component: <ReservationTermPicker step={'THIRD'} />,
        step: 'THIRD',
    },
    {
        label: 'Prosím vyplňte své kontaktni údaje',
        component: <>Prosím vyplňte své kontaktni údaje</>,
        step: 'FORTH',
    },
]

const getNumberStepByName = (name, steps) => {
    const numberOfSteps = steps.length
    switch (name) {
        case 'COMPLETED':
        case 'READY':
        case 'ERROR':
            return numberOfSteps - 1
        default:
            return findIndex(propEq('step', name))(steps)
    }
}
const getStepsConfiguration = (stepsConfiguration, error, completedOk = false) => [
    ...stepsConfiguration,
    DEFAULT_STEPS.ready,
    { ...(completedOk && DEFAULT_STEPS.completed) },
    { ...(error && DEFAULT_STEPS.error) },
]

export const ReservationStepper = ({ stepsConfiguration = mockStepsConfiguration }) => {
    const activeStep = useSelector(getActiveStep) // 'COMPLETED'
    const { errors, completed } = useSelector(getLastBooking)

    const steps = useMemo(
        () => reject(isNilOrEmpty, getStepsConfiguration(stepsConfiguration, errors, completed)),
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
            <Stepper activeStep={getNumberStepByName(activeStep, steps)} orientation="vertical">
                {steps.map(({ label, step }) => (
                    <Step key={label}>
                        <StepLabel error={!!errors}>{label}</StepLabel>
                        <StepContent>
                            <Box>{getReservationContentByStep(step, stepsConfiguration)}</Box>
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
