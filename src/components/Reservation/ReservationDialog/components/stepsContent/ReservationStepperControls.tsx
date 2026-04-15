import { Box, Button, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { isMobile } from '../../../../../utils'
import { StepsConfiguration } from '../../helpers/getReservationContentByStep'
import { useReservation } from '../../../../../context/Reservation'

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    minHeight: isMobile ? theme.spacing(7.5) : theme.spacing(4),
    background: theme.palette.primary.main,
    boxShadow: 'none',
    textTransform: 'none',
}))

const getIndexOfActiveStep = (steps: StepsConfiguration, activeStep: string) =>
    steps.findIndex((step) => step.step === activeStep)

const ReservationStepperControls = ({ steps }: { steps: StepsConfiguration }) => {
    const {
        lastBooking: { isLoading },
        activeStep,
        setters: { setActiveStep },
        api: { bookAnAppointment },
        isReservationBtnDisabled,
    } = useReservation()

    const handleChangeStep = (stepValue: string) => setActiveStep(stepValue)
    const handleConfirmAppointment = () => bookAnAppointment()

    return (
        !['COMPLETED', 'ERROR', 'LOADING'].includes(activeStep) && (
            <Box
                sx={(theme) => ({
                    marginBottom: theme.spacing(2),
                    display: 'flex',
                    justifyContent: 'space-between',
                })}
            >
                {getIndexOfActiveStep(steps, activeStep) !== 0 && (
                    <StyledButton
                        variant="outlined"
                        color="inherit"
                        onClick={() =>
                            handleChangeStep(steps[getIndexOfActiveStep(steps, activeStep) - 1]?.step ?? '')
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
                            : handleChangeStep(steps[getIndexOfActiveStep(steps, activeStep) + 1]?.step ?? '')
                    }
                    disabled={isReservationBtnDisabled}
                >
                    {activeStep === 'READY' ? 'Odeslat objednávku' : 'Pokračovat dále'}
                </StyledButton>
            </Box>
        )
    )
}

export default ReservationStepperControls
