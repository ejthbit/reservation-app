import { Grid, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { useGetCategories } from '../../../../../hooks/useGetCategories'
import { makeReservationProcessInfo } from '../../../../../store/reservationProcess/selectors'
import { getAmbulanceNameById, getCategoryNameById, isNilOrEmpty } from '../../../../../utils'
import { useGetAmbulances } from '../../../../../hooks/useGetAmbulances'
import { useMemo } from 'react'

const getAppointmentDate = makeReservationProcessInfo()

const ReservationSummary = () => {
    const {
        contactInformation,
        selectedDate,
        selectedCategory,
        selectedAmbulanceId,
        selectedTime,
        selectedDoctor,
    } = useSelector(getAppointmentDate)
    const { data: categories } = useGetCategories(selectedDoctor)
    const { data: ambulances } = useGetAmbulances()

    const { name, address } = useMemo(
        () => getAmbulanceNameById(selectedAmbulanceId, ambulances),
        [ambulances]
    )

    const renderContactInfo = () => {
        return Object.entries(contactInformation).map(([key, value]) => {
            if (!isNilOrEmpty(value)) {
                return (
                    <Grid item key={key}>
                        <Typography variant="caption">{value}</Typography>
                    </Grid>
                )
            }
            return null
        })
    }

    return (
        <Grid container gap="20%">
            <Grid item>
                <Typography variant="h5">Datum návštevy</Typography>
                <Grid item display="flex" key={selectedDate} flexDirection="column">
                    <Typography variant="caption">
                        Kdy? {selectedDate}-{selectedTime}
                    </Typography>
                    <Typography variant="caption">
                        Kde? Ambulance {name} ({address})
                    </Typography>
                    <Typography variant="caption">
                        Typ vyšetření: {getCategoryNameById(selectedCategory, categories)}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item>
                <Typography variant="h5">Kontaktní údaje</Typography>
                {renderContactInfo()}
            </Grid>
        </Grid>
    )
}

export default ReservationSummary
