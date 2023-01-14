import { equals, values } from 'ramda'
import StepContentWithBtn from './StepContentWithBtn'
import PropTypes from 'prop-types'
import { CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { getLastBooking } from '../../../../store/reservationProcess/selectors'

export const VARIANTS = {
    SUCCESS: 'success',
    ERROR: 'error',
}

const ReservationStatus = ({ variant }) => {
    const { completed, errors } = useSelector(getLastBooking)

    if (equals(variant, VARIANTS.ERROR))
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
ReservationStatus.propTypes = {
    variant: PropTypes.oneOf(values(VARIANTS)),
}

export default ReservationStatus
