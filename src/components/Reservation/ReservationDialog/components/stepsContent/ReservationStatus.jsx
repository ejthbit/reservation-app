import { CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
    bookAnAppointment,
    clearBooking,
    clearReservation,
    setActiveStep,
} from '../../../../../store/reservationProcess/reservationProcessSlice'
import { getLastBooking } from '../../../../../store/reservationProcess/selectors'
import { isNilOrEmpty } from '../../../../../utils'
import StepContentWithBtn from './StepContentWithBtn'

const ReservationStatus = () => {
    const { completed, errors } = useSelector(getLastBooking)

    const dispatch = useDispatch()

    if (completed)
        return (
            <StepContentWithBtn
                text="Vaše objednávka byla uspěšná!"
                variant="primary"
                btnText="Vytvořit novou objednávku"
                onBtnClick={() => {
                    dispatch(clearBooking())
                    dispatch(clearReservation())
                }}
            />
        )
    if (!isNilOrEmpty(errors))
        return (
            <StepContentWithBtn
                text={errors.message}
                variant="error"
                btnText="Zkusit znovu"
                onBtnClick={() => dispatch(bookAnAppointment())}
                secondaryBtnText="Vratit se zpět"
                onSecondaryBtnClick={() => {
                    dispatch(clearBooking())
                    dispatch(setActiveStep('READY'))
                }}
            />
        )
    return <CircularProgress />
}

export default ReservationStatus
