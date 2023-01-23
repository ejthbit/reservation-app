import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { fetchDoctorServicesForSelectedMonth } from 'src/store/bookings/actions'
// import { makeServicesSelector } from 'src/store/bookings/selectors'
import {
    setPreferredDoctor,
    setReservationBtnDisabled,
} from '../../store/reservationProcess/reservationProcessSlice'
import {
    getPreferredDoctor,
    getSelectedAmbulance,
    getSelectedDate,
} from '../../store/reservationProcess/selectors'
import { useLazyGetDoctorsForSelectedAmbulanceQuery } from '../../store/reservationProcess/services'
// import { isNilOrEmpty } from '../../utils'
import Dropdown from '../BuildingBlocks/Dropdown'

const ReservationDoctorPreference = () => {
    const dispatch = useDispatch()

    const selectedAmbulanceId = useSelector(getSelectedAmbulance)
    const selectedDoctor = useSelector(getPreferredDoctor)
    const selectedDate = useSelector(getSelectedDate)
    // const selectedMonth = useMemo(
    //     () => selectedDate.slice(0, 7),
    //     [selectedDate]
    // )
    // const doctorServices = useMemoizedSelector(makeServicesSelector, {}, [
    //     selectedDoctor,
    //     selectedDate,
    //     selectedAmbulanceId,
    // ])

    const [
        getDoctorsForSelectedAmbulance,
        { data: doctorsForSelectedAmbulance },
    ] = useLazyGetDoctorsForSelectedAmbulanceQuery()

    useEffect(() => {
        dispatch(setReservationBtnDisabled(false))
        // TODO: Investigate
        // const serviceItemExists = find(
        //     ({ month, workplace }) =>
        //         equals(month, selectedMonth) &&
        //         equals(workplace, selectedAmbulanceId),
        //     doctorServices
        // )
        // if (isNilOrEmpty(serviceItemExists))
        //     dispatch(
        //         fetchDoctorServicesForSelectedMonth({
        //             month: format(new Date(selectedDate), 'yyyy-MM'),
        //             workplace: selectedAmbulanceId,
        //         })
        //     )
        getDoctorsForSelectedAmbulance()
    }, [
        selectedAmbulanceId,
        selectedDate,
        dispatch,
        getDoctorsForSelectedAmbulance,
    ])

    return (
        <Dropdown
            value={selectedDoctor}
            onChange={(e) => dispatch(setPreferredDoctor(e.target.value))}
            notSelectedLabel="Nemám preferenci"
            options={doctorsForSelectedAmbulance}
        />
    )
}

export default ReservationDoctorPreference
