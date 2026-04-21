import { useMemo } from 'react'
import { makeAvailableTimeSlotsWithTimeOnly, useReservation } from '../../../../../context/Reservation'
import useReservationButton from '../../../../../hooks/useReservationButton'
import { Dropdown } from '../../../../common'

const ReservationTime = ({ step }: { step: string }) => {
    const {
        availableTimeSlots: { slots, isLoading },
        selectedDate,
        selectedTime,
        selectedCategory,
        setters: { setSelectedTime },
    } = useReservation()
    useReservationButton({ dependency: [selectedTime, selectedCategory], step, isRequired: true })
    const availableTimeSlots = useMemo(
        () => (slots ? makeAvailableTimeSlotsWithTimeOnly(slots) : []),
        [selectedDate],
    )

    return (
        <Dropdown
            isLoading={isLoading}
            label="Čas návštevy"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value as string)}
            options={availableTimeSlots.map(({ timeSlotStart }) => ({
                value: timeSlotStart,
                label: timeSlotStart.slice(0, 5),
            }))}
            required
        />
    )
}

export default ReservationTime
