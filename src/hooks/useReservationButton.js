import { equals } from 'ramda'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveStep, getDisabledReservationBtn } from '../store/reservationProcess'
import { setReservationBtnDisabled } from '../store/reservationProcess/reservationProcessSlice'
import { isNilOrEmpty } from '../utils'

const useReservationButton = ({ dependency = [], step, isRequired = false, isValid = true }) => {
    const dispatch = useDispatch()
    const activeStep = useSelector(getActiveStep)
    const isReservationBtnDisabled = useSelector(getDisabledReservationBtn)

    useEffect(() => {
        if (equals(activeStep, step) && isRequired) {
            if (dependency.some(isNilOrEmpty) && !isReservationBtnDisabled && isValid)
                dispatch(setReservationBtnDisabled(true))
            else if (!dependency.some(isNilOrEmpty)) dispatch(setReservationBtnDisabled(false))
        }
    }, [dependency, activeStep, isRequired, step, isValid])
}

export default useReservationButton
