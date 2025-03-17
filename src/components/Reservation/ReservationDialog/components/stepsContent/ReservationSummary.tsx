import { Grid, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useGetAmbulances } from '../../../../../hooks/useGetAmbulances'
import { useGetCategories } from '../../../../../hooks/useGetCategories'
import { getAmbulanceNameById, getCategoryNameById, isNilOrEmpty } from '../../../../../utils'
import { useReservation } from '../../../../../context/Reservation'

const contactInformationLabels = {
    birthdate: 'Datum narození:',
    phone: 'Telefon:',
    email: 'Email:',
    name: 'Jméno:',
}
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
                        <Typography variant="body2">
                            <strong>
                                {contactInformationLabels[key as keyof typeof contactInformationLabels]}
                            </strong>{' '}
                            {value}
                        </Typography>
                    </Grid>
                )
            }
            return null
        })
    }

    return (
        <Grid container flexDirection="column">
            <Grid
                item
                sx={{ border: '1px solid #E6E7EB', borderRadius: 2, p: 2, backgroundColor: '#f9fafb' }}
                marginBottom={2}
            >
                <Typography variant="h6" fontWeight="100">
                    Datum návštevy
                </Typography>
                <Grid item display="flex" key={selectedDate} flexDirection="column">
                    <Typography variant="body2">
                        <strong>Kdy?</strong> {selectedDate} {selectedTime}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Kde?</strong> Ambulance {ambulance?.name} ({ambulance?.address})
                    </Typography>
                    <Typography variant="body2">
                        <strong>Typ vyšetření</strong>{' '}
                        {selectedCategory &&
                            categories &&
                            getCategoryNameById(selectedCategory as string, categories)}
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                item
                sx={{ border: '1px solid #E6E7EB', borderRadius: 2, p: 2, backgroundColor: '#f9fafb' }}
            >
                <Typography variant="h6" fontWeight="100">
                    Kontaktní údaje
                </Typography>
                {renderContactInfo()}
            </Grid>
        </Grid>
    )
}

export default ReservationSummary
