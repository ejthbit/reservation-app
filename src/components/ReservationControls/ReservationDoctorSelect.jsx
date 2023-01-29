import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    setPreferredDoctor,
    setSelectedCategory,
    setSelectedTime,
} from '../../store/reservationProcess/reservationProcessSlice'
import { makeReservationProcessInfo } from '../../store/reservationProcess/selectors'
import { useLazyGetDoctorsForSelectedAmbulanceQuery } from '../../store/reservationProcess/services'
import Dropdown from '../BuildingBlocks/Dropdown'
import useReservationButton from '../../hooks/useReservationButton'
import { isNilOrEmpty } from '../../utils'

const getReservationProcessInfo = makeReservationProcessInfo()
const ReservationDoctorSelect = ({ step }) => {
    const dispatch = useDispatch()
    const { selectedAmbulanceId, selectedDoctor, selectedTime, selectedCategory } =
        useSelector(getReservationProcessInfo)

    useReservationButton({ step, isRequired: true })

    const [getDoctorsForSelectedAmbulance, { data: doctorsForSelectedAmbulance, isLoading }] =
        useLazyGetDoctorsForSelectedAmbulanceQuery()

    useEffect(() => {
        if (!isNilOrEmpty(selectedAmbulanceId)) getDoctorsForSelectedAmbulance(selectedAmbulanceId)
    }, [])

    return (
        <Dropdown
            value={selectedDoctor}
            isLoading={isLoading}
            onChange={(e) => {
                dispatch(setPreferredDoctor(e.target.value))
                if (!isNilOrEmpty(selectedTime)) dispatch(setSelectedTime(''))
                if (!isNilOrEmpty(selectedCategory)) dispatch(setSelectedCategory(''))
            }}
            notSelectedLabel="Nemám preferenci"
            options={doctorsForSelectedAmbulance}
        />
    )
}

export default ReservationDoctorSelect
