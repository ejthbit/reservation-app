import { equals } from 'ramda'
import { useEffect } from 'react'
import { useReservation } from 'src/context/Reservation/useReservation'
import { isNilOrEmpty } from '../utils'

const useReservationButton = ({
    dependency = [],
    step,
    isRequired = false,
    isValid = true,
}: {
    step: string
    isRequired?: boolean
    isValid?: boolean
    dependency?: any[]
}) => {
    const {
        isReservationBtnDisabled,
        activeStep,
        setters: { setReservationBtnDisabled },
    } = useReservation()

    useEffect(() => {
        if (equals(activeStep, step) && isRequired) {
            if (dependency.some(isNilOrEmpty) && !isReservationBtnDisabled && isValid)
                setReservationBtnDisabled(true)
            else if (!dependency.some(isNilOrEmpty)) setReservationBtnDisabled(false)
        }
    }, [dependency, activeStep, isRequired, step, isValid])
}

export default useReservationButton
