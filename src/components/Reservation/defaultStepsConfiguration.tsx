import { Grid } from '@mui/material'
import { ReservationAmbulanceSelect, ReservationDoctorSelect } from './ReservationControls'
import {
    ReservationBirthDate,
    ReservationEmail,
    ReservationName,
    ReservationPhone,
} from './ReservationControls/ReservationContact'
import ReservationContactInformationDisableProvider from './ReservationControls/ReservationDisableProvider'
import ReservationTermPicker from './ReservationControls/ReservationTermPicker/ReservationTermPicker'

const defaultStepsConfiguration = [
    {
        label: 'Výběr ambulance',
        component: <ReservationAmbulanceSelect step={'FIRST'} />,
        step: 'FIRST',
    },
    {
        label: 'Preference lékaře',
        component: <ReservationDoctorSelect step={'SECOND'} />,
        step: 'SECOND',
    },
    {
        label: 'Vyberte termín své navštevy',
        component: <ReservationTermPicker step={'THIRD'} />,
        step: 'THIRD',
    },
    {
        label: 'Prosím vyplňte své kontaktni údaje',
        component: (
            <ReservationContactInformationDisableProvider birthDateDep={true} nameDep={true} step="FORTH">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <ReservationName step={'FORTH'} isRequired />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ReservationBirthDate step={'FORTH'} isRequired />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ReservationEmail step={'FORTH'} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ReservationPhone step={'FORTH'} />
                    </Grid>
                </Grid>
            </ReservationContactInformationDisableProvider>
        ),
        step: 'FORTH',
    },
]
export default defaultStepsConfiguration
