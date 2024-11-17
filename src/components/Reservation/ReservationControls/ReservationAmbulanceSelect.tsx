import { SelectChangeEvent } from '@mui/material'
import useReservationButton from '../../../hooks/useReservationButton'
import { AmbulanceSelect } from '../../common'
import { useReservation } from '../../../context/Reservation'
import { useDoctorServices } from '../../../hooks'
const ReservationAmbulanceSelect = ({ showLabel = false, step }: { showLabel?: boolean; step: string }) => {
    const {
        api: { fetchDoctorServicesForSelectedMonth },
    } = useDoctorServices()

    const {
        selectedAmbulance,
        selectedDate,
        setters: { setSelectedAmbulance, setPreferredDoctor },
    } = useReservation()
    useReservationButton({ dependency: [selectedAmbulance], step, isRequired: true })

    const handleChangeAmbulance = (e: SelectChangeEvent<any>) => {
        setSelectedAmbulance(e.target.value)
        fetchDoctorServicesForSelectedMonth({
            month: selectedDate.slice(0, 7),
            workplace: e.target.value,
        })
        setPreferredDoctor('')
    }

    return (
        <AmbulanceSelect
            showLabel={showLabel}
            selectedValueId={selectedAmbulance ?? ''}
            onAmbulanceSelect={handleChangeAmbulance}
        />
    )
}

export default ReservationAmbulanceSelect
