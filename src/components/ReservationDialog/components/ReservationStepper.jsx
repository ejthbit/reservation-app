import { Grid, Step, StepContent, StepLabel, Stepper } from '@mui/material'
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
import {
    ReservationBirthDate,
    ReservationName,
    ReservationEmail,
    ReservationPhone,
} from '../../ReservationControls/ReservationContact'
const mockStepsConfiguration = [
    {
        label: 'Výběr ambulance',
        component: <ReservationAmbulanceSelect step={'FIRST'} />,
        step: 'FIRST',
    },
    {
        label: 'Preference lékaře',
        component: <ReservationDoctorSelect step={'SECOND'} />,
        step: 'SECOND',
    },
    {
        label: 'Vyberte termín své navštevy',
        component: <ReservationTermPicker step={'THIRD'} />,
        step: 'THIRD',
    },
    {
        label: 'Prosím vyplňte své kontaktni údaje',
        component: (
            <Grid container>
                <Grid item>
                    {/* <ReservationButtonProvider dependencies={['name, birthDate, phone']}> */}
                    <ReservationName step={'FORTH'} />
                    <ReservationBirthDate step={'FORTH'} />
                    <ReservationEmail step={'FORTH'} />
                    <ReservationPhone step={'FORTH'} />
                    {/* </ReservationButtonProvider> */}
                </Grid>
            </Grid>
        ),
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
const getStepsConfiguration = (stepsConfiguration, loading, error, completedOk = false) => [
    ...stepsConfiguration,
    DEFAULT_STEPS.ready,
    { ...(loading && DEFAULT_STEPS.default) },
    { ...(completedOk && DEFAULT_STEPS.completed) },
    { ...(error && DEFAULT_STEPS.error) },
]

export const ReservationStepper = ({ stepsConfiguration = mockStepsConfiguration }) => {
    const activeStep = useSelector(getActiveStep)
    const { errors, completed, isLoading } = useSelector(getLastBooking)

    const steps = useMemo(
        () => reject(isNilOrEmpty, getStepsConfiguration(stepsConfiguration, isLoading, errors, completed)),
        [stepsConfiguration, isLoading, errors, completed]
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
