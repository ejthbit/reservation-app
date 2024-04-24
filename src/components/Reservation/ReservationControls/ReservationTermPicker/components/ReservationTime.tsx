import { ChangeEvent, useMemo } from 'react'
import { makeAvailableTimeSlotsWithTimeOnly, useReservation } from 'src/context/Reservation'
import useReservationButton from '../../../../../hooks/useReservationButton'
//@ts-ignore
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
            onChange={(e: ChangeEvent<any>) => setSelectedTime(e.target.value)}
            options={availableTimeSlots.map(({ timeSlotStart }) => ({
                value: timeSlotStart,
                label: timeSlotStart.slice(0, 5),
            }))}
            required
        />
    )
}

export default ReservationTime
