import { Box, Button, ButtonGroup, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { findIndex, includes, propEq } from 'ramda'
import {
    bookAnAppointment,
    setActiveStep,
} from '../../../../../store/reservationProcess/reservationProcessSlice'
import {
    getActiveStep,
    getDisabledReservationBtn,
    getLastBooking,
} from '../../../../../store/reservationProcess/selectors'
import { isMobile } from '../../../../../utils'

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    minHeight: isMobile ? theme.spacing(7.5) : theme.spacing(4),
    boxShadow: 'none',
}))

const getIndexOfActiveStep = (steps, activeStep) => {
    return findIndex(propEq('step', activeStep))(steps)
}

const ReservationStepperControls = ({ steps }) => {
    const dispatch = useDispatch()
    const activeStep = useSelector(getActiveStep)
    const { isLoading } = useSelector(getLastBooking)

    const disabledReservationBtn = useSelector(getDisabledReservationBtn)
    const handleChangeStep = (stepValue) => dispatch(setActiveStep(stepValue))
    const handleConfirmAppointment = () => dispatch(bookAnAppointment())

    return (
        !includes(activeStep, ['COMPLETED', 'ERROR', 'LOADING']) && (
            <Box sx={(theme) => ({ marginBottom: theme.spacing(2) })}>
                <ButtonGroup orientation={isMobile ? 'vertical' : 'horizontal'}>
                    {getIndexOfActiveStep(steps, activeStep) !== 0 && (
                        <StyledButton
                            variant="contained"
                            color="inherit"
                            onClick={() =>
                                handleChangeStep(steps[getIndexOfActiveStep(steps, activeStep) - 1].step)
                            }
                        >
                            Vratit se zpět
                        </StyledButton>
                    )}
                    <StyledButton
                        variant="contained"
                        color="primary"
                        startIcon={isLoading && <CircularProgress color="primary" />}
                        onClick={() =>
                            activeStep === 'READY'
                                ? handleConfirmAppointment()
                                : handleChangeStep(steps[getIndexOfActiveStep(steps, activeStep) + 1].step)
                        }
                        disabled={disabledReservationBtn}
                    >
                        {activeStep === 'READY' ? 'Odeslat objednávku' : 'Pokračovat dále'}
                    </StyledButton>
                </ButtonGroup>
            </Box>
        )
    )
}

ReservationStepperControls.propTypes = {
    steps: PropTypes.array,
}

export default ReservationStepperControls
