import { CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { getLastBooking } from '../../../../store/reservationProcess/selectors'
import { isNilOrEmpty } from '../../../../utils'
import StepContentWithBtn from './StepContentWithBtn'

const ReservationStatus = () => {
    const { completed, errors } = useSelector(getLastBooking)
    console.log(completed)
    if (!isNilOrEmpty(errors))
        return (
            <StepContentWithBtn
                text={errors}
                variant="error"
                btnText="Zkusit znovu"
                // onBtnClick={() => dispatch(bookAnAppointment())}
                secondaryBtnText="Vratit se zpět"
                // onSecondaryBtnClick={() => {
                //     dispatch(clearBooking())
                //     dispatch(setActiveStep('PREVIOUS'))
                // }}
            />
        )
    return completed ? (
        <StepContentWithBtn
            text="Vaše objednávka byla uspěšná!"
            variant="primary"
            btnText="Vytvořit novou objednávku"
            // onBtnClick={() => {
            //     dispatch(clearBooking())
            //     dispatch(clearReservation())
            // }}
        />
    ) : (
        <CircularProgress />
    )
}

export default ReservationStatus
