import { Grid, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useGetAmbulances } from '../../../../../hooks/useGetAmbulances'
import { useGetCategories } from '../../../../../hooks/useGetCategories'
import { getAmbulanceNameById, getCategoryNameById, isNilOrEmpty } from '../../../../../utils'
import { useReservation } from '../../../../../context/Reservation'

const ReservationSummary = () => {
    const {
        contactInformation,
        selectedDate,
        selectedCategory,
        selectedAmbulance,
        selectedTime,
        preferredDoctor,
    } = useReservation()
    const { data: categories } = useGetCategories(preferredDoctor as string)
    const { data: ambulances } = useGetAmbulances()

    const ambulance = useMemo(
        () => (selectedAmbulance ? getAmbulanceNameById(selectedAmbulance, ambulances) : null),
        [ambulances],
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
                        Kdy? {selectedDate} {selectedTime}
                    </Typography>
                    <Typography variant="caption">
                        Kde? Ambulance {ambulance?.name} ({ambulance?.address})
                    </Typography>
                    <Typography variant="caption">
                        Typ vyšetření:{' '}
                        {selectedCategory && getCategoryNameById(selectedCategory as string, categories)}
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
