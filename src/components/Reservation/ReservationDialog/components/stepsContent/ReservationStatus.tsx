import { CircularProgress } from '@mui/material'

import { isNilOrEmpty } from '../../../../../utils'
import StepContentWithBtn from './StepContentWithBtn'
import { useReservation } from '../../../../../context/Reservation'

const ReservationStatus = () => {
    const {
        lastBooking: { completed, errors },
        api: { bookAnAppointment, clearBooking, clearReservation },
        setters: { setActiveStep },
    } = useReservation()

    if (completed)
        return (
            <StepContentWithBtn
                text="Vaše objednávka byla uspěšná!"
                variant="primary"
                btnText="Vytvořit novou objednávku"
                onBtnClick={() => {
                    clearBooking()
                    clearReservation()
                }}
            />
        )
    if (!isNilOrEmpty(errors))
        return (
            <StepContentWithBtn
                text={errors?.message}
                variant="error"
                btnText="Zkusit znovu"
                onBtnClick={() => bookAnAppointment()}
                secondaryBtnText="Vratit se zpět"
                onSecondaryBtnClick={() => {
                    clearBooking()
                    setActiveStep('READY')
                }}
            />
        )
    return <CircularProgress />
}

export default ReservationStatus
