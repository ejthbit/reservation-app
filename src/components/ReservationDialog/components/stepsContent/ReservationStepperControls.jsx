import { Box, Button, ButtonGroup, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
// import { bookAnAppointment } from 'src/store/bookings/actions'
import {
    getActiveStep,
    getDisabledReservationBtn,
    getLastBooking,
} from '../../../../store/reservationProcess/selectors'
import { setActiveStep } from '../../../../store/reservationProcess/reservationProcessSlice'
import { isMobile } from '../../../../utils'

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    minHeight: isMobile ? theme.spacing(7.5) : theme.spacing(4),
    boxShadow: 'none',
}))

const ReservationStepperControls = () => {
    const dispatch = useDispatch()
    const activeStep = useSelector(getActiveStep)
    const { isLoading, errors } = useSelector(getLastBooking)

    const disabledReservationBtn = useSelector(getDisabledReservationBtn)

    const handleChangeStep = (stepValue) => dispatch(setActiveStep(stepValue))
    const handleConfirmAppointment = () => {
        // dispatch(bookAnAppointment())
        handleChangeStep(errors ? 'ERROR' : 1)
    }

    return (
        <Box sx={(theme) => ({ marginBottom: theme.spacing(2) })}>
            <ButtonGroup orientation={isMobile ? 'vertical' : 'horizontal'}>
                {activeStep !== 'COMPLETED' && (
                    <StyledButton
                        variant="contained"
                        color="inherit"
                        onClick={() => handleChangeStep('PREVIOUS')}
                    >
                        Vratit se zpět
                    </StyledButton>
                )}
                <StyledButton
                    variant="contained"
                    color="primary"
                    startIcon={
                        isLoading && <CircularProgress color="primary" />
                    }
                    onClick={() =>
                        activeStep === 'READY'
                            ? handleConfirmAppointment()
                            : handleChangeStep('NEXT')
                    }
                    disabled={disabledReservationBtn}
                >
                    {activeStep === 'READY'
                        ? 'Odeslat objednávku'
                        : 'Pokračovat dále'}
                </StyledButton>
            </ButtonGroup>
        </Box>
    )
}

export default ReservationStepperControls
