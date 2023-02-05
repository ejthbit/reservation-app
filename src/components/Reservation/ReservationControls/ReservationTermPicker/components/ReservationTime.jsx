import { useDispatch, useSelector } from 'react-redux'
import {
    getAreAvailableTimeSlotsLoading,
    makeAvailableTimeSlotsWithTimeOnly,
    makeReservationProcessInfo,
} from '../../../../store/reservationProcess'
import { setSelectedTime } from '../../../../store/reservationProcess/reservationProcessSlice'
import Dropdown from '../../../BuildingBlocks/Dropdown'
import { useMemoizedSelector } from '../../../../hooks'
import useReservationButton from '../../../../hooks/useReservationButton'
import PropTypes from 'prop-types'

const getReservationProcessInfo = makeReservationProcessInfo()

const ReservationTime = ({ step }) => {
    const dispatch = useDispatch()
    const { selectedDate, selectedTime } = useSelector(getReservationProcessInfo)
    useReservationButton({ dependency: [selectedTime], step, isRequired: true })
    const availableTimeSlots = useMemoizedSelector(makeAvailableTimeSlotsWithTimeOnly, {}, [selectedDate])
    const areAvailableTimeSlotsLoading = useSelector(getAreAvailableTimeSlotsLoading)

    return (
        <Dropdown
            isLoading={areAvailableTimeSlotsLoading}
            label="Čas návštevy"
            value={selectedTime}
            onChange={(e) => dispatch(setSelectedTime(e.target.value))}
            options={availableTimeSlots.map(({ timeSlotStart }) => ({
                value: timeSlotStart,
                label: timeSlotStart.slice(0, 5),
            }))}
            required
        />
    )
}

ReservationTime.propTypes = {
    step: PropTypes.string,
}

export default ReservationTime
