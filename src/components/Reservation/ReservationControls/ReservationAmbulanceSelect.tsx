import { SelectChangeEvent } from '@mui/material'
import { useReservation } from 'src/context/Reservation/useReservation'
import { useDoctorServices } from 'src/hooks'
import useReservationButton from '../../../hooks/useReservationButton'
//@ts-ignore
import { AmbulanceSelect } from '../../common'
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
            selectedValueId={selectedAmbulance}
            onAmbulanceSelect={handleChangeAmbulance}
        />
    )
}

export default ReservationAmbulanceSelect
