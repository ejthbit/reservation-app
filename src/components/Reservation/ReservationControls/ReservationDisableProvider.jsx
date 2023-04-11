import { reject } from 'ramda'
import { useSelector } from 'react-redux'
import { useReservationButton } from '../../../hooks'
import { getContactInformation } from '../../../store/reservationProcess'
const ReservationContactInformationDisableProvider = ({
    nameDep,
    emailDep,
    phoneDep,
    birthDateDep,
    step,
    children,
}) => {
    const { name, email, phone, birthDate } = useSelector(getContactInformation)
    useReservationButton({
        dependency: reject(
            (value) => value === undefined,
            [nameDep && name, emailDep && email, birthDateDep && birthDate, phoneDep && phone]
        ),
        step,
        isRequired: true,
    })

    return children
}

export default ReservationContactInformationDisableProvider
