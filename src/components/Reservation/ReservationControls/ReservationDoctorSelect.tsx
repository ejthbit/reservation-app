import { SelectChangeEvent } from '@mui/material'
import { useEffect } from 'react'
import useReservationButton from '../../../hooks/useReservationButton'
import { isNilOrEmpty } from '../../../utils'
import { Dropdown } from '../../common'
import { makeArrayOfLabelValue, useReservation } from '../../../context/Reservation'

const ReservationDoctorSelect = ({ step }: { step: string }) => {
    const {
        selectedAmbulance,
        preferredDoctor: selectedDoctor,
        selectedTime,
        selectedCategory,
        doctorsForSelectedAmbulance: { data: doctorsForSelectedAmbulance, isLoading },
        setters: { setPreferredDoctor, setSelectedTime, setSelectedCategory },
        api: { getDoctorsForSelectedAmbulance },
    } = useReservation()

    useReservationButton({ step, isRequired: true })

    useEffect(() => {
        if (selectedAmbulance && getDoctorsForSelectedAmbulance)
            getDoctorsForSelectedAmbulance(selectedAmbulance)
    }, [])

    return doctorsForSelectedAmbulance ? (
        <Dropdown
            value={selectedDoctor}
            isLoading={isLoading}
            onChange={(e: SelectChangeEvent<any>) => {
                setPreferredDoctor(e.target.value)
                if (!isNilOrEmpty(selectedTime)) setSelectedTime('')
                if (!isNilOrEmpty(selectedCategory)) setSelectedCategory('')
            }}
            notSelectedLabel="Nemám preferenci"
            options={makeArrayOfLabelValue('name', 'doctor_id', doctorsForSelectedAmbulance)}
        />
    ) : null
}

export default ReservationDoctorSelect
