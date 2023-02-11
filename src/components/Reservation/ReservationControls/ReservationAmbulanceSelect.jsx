import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import useReservationButton from '../../../hooks/useReservationButton'
import {
    setPreferredDoctor,
    setSelectedAmbulance,
} from '../../../store/reservationProcess/reservationProcessSlice'
import { makeReservationProcessInfo } from '../../../store/reservationProcess/selectors'
import { useLazyGetDoctorServicesForMonthQuery } from '../../../store/reservationProcess/services'
import { AmbulanceSelect } from '../../common'
const getReservationProcessInfo = makeReservationProcessInfo()
const ReservationAmbulanceSelect = ({ showLabel = false, step }) => {
    const [fetchDoctorServicesForSelectedMonth] = useLazyGetDoctorServicesForMonthQuery()

    const { selectedAmbulanceId, selectedMonth } = useSelector(getReservationProcessInfo)
    useReservationButton({ dependency: [selectedAmbulanceId], step, isRequired: true })
    const dispatch = useDispatch()

    const handleChangeAmbulance = (e) => {
        dispatch(setSelectedAmbulance(e.target.value))
        fetchDoctorServicesForSelectedMonth({
            month: selectedMonth,
            workplace: e.target.value,
        })
        dispatch(setPreferredDoctor(''))
    }

    return (
        <AmbulanceSelect
            showLabel={showLabel}
            selectedValueId={selectedAmbulanceId}
            onAmbulanceSelect={handleChangeAmbulance}
        />
    )
}
ReservationAmbulanceSelect.propTypes = {
    showLabel: PropTypes.bool,
    step: PropTypes.string,
}
export default ReservationAmbulanceSelect
