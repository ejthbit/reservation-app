import { SelectChangeEvent } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useReservation } from 'src/context/Reservation/useReservation'
import useReservationButton from '../../../hooks/useReservationButton'
import { isNilOrEmpty } from '../../../utils'
//@ts-ignore
import { Dropdown } from '../../common'
import { makeArrayOfLabelValue } from 'src/context/Reservation'

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

    if (doctorsForSelectedAmbulance) {
        console.log(makeArrayOfLabelValue('name', 'doctor_id', doctorsForSelectedAmbulance))
    }

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

ReservationDoctorSelect.propTypes = {
    step: PropTypes.string.isRequired,
}
export default ReservationDoctorSelect
