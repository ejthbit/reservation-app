import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPreferredDoctor } from '../../store/reservationProcess/reservationProcessSlice'
import { makeReservationProcessInfo } from '../../store/reservationProcess/selectors'
import { useLazyGetDoctorsForSelectedAmbulanceQuery } from '../../store/reservationProcess/services'
import Dropdown from '../BuildingBlocks/Dropdown'

import { isNilOrEmpty } from '../../utils'

const getReservationProcessInfo = makeReservationProcessInfo()
const ReservationDoctorSelect = () => {
    const dispatch = useDispatch()
    const { selectedAmbulanceId, selectedDoctor } = useSelector(getReservationProcessInfo)

    const [getDoctorsForSelectedAmbulance, { data: doctorsForSelectedAmbulance, isLoading }] =
        useLazyGetDoctorsForSelectedAmbulanceQuery()

    useEffect(() => {
        if (!isNilOrEmpty(selectedAmbulanceId)) getDoctorsForSelectedAmbulance(selectedAmbulanceId)
    }, [])

    return (
        <Dropdown
            value={selectedDoctor}
            isLoading={isLoading}
            onChange={(e) => dispatch(setPreferredDoctor(e.target.value))}
            notSelectedLabel="Nemám preferenci"
            options={doctorsForSelectedAmbulance}
        />
    )
}

export default ReservationDoctorSelect
