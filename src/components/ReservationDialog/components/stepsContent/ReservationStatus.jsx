import { CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
    clearBooking,
    clearReservation,
    setActiveStep,
} from '../../../../store/reservationProcess/reservationProcessSlice'
import {
    getLastBooking,
    makeReservationProcessInfo,
} from '../../../../store/reservationProcess/selectors'
import { isNilOrEmpty } from '../../../../utils'
import { prepareReservationForCreation } from '../../helpers'
import StepContentWithBtn from './StepContentWithBtn'
const getReservationProcessInfo = makeReservationProcessInfo()

const ReservationStatus = () => {
    const { completed, errors } = useSelector(getLastBooking)
    const reservationProcessData = useSelector(getReservationProcessInfo)
    console.log(prepareReservationForCreation(reservationProcessData))

    console.log(completed)
    const dispatch = useDispatch()
    if (!isNilOrEmpty(errors))
        return (
            <StepContentWithBtn
                text={errors}
                variant="error"
                btnText="Zkusit znovu"
                onBtnClick={() => console.log('BOOK AN APPOINTMENT')}
                secondaryBtnText="Vratit se zpět"
                onSecondaryBtnClick={() => {
                    dispatch(clearBooking())
                    dispatch(setActiveStep('READY'))
                }}
            />
        )
    return completed ? (
        <StepContentWithBtn
            text="Vaše objednávka byla uspěšná!"
            variant="primary"
            btnText="Vytvořit novou objednávku"
            onBtnClick={() => {
                dispatch(clearBooking())
                dispatch(clearReservation())
            }}
        />
    ) : (
        <CircularProgress />
    )
}

export default ReservationStatus
