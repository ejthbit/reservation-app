import { Grid } from '@mui/material'
import { Route, Routes as RRoutes, useNavigate } from 'react-router-dom'
import {
    Login,
    ReservationDialog,
    AdministrationPage,
    AnnouncementsList,
    ReservationAmbulanceSelect,
    ReservationDoctorSelect,
    ReservationTermPicker,
    ReservationName,
    ReservationBirthDate,
    ReservationEmail,
    ReservationPhone,
} from './components'
import ProtectedRoute from './components/common/ProtectedRoute'
const mockStepsConfiguration = [
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
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    {/* <ReservationButtonProvider dependencies={['name, birthDate, phone']}> */}
                    <ReservationName step={'FORTH'} />
                    {/* </ReservationButtonProvider> */}
                </Grid>
                <Grid item xs={12} md={6}>
                    <ReservationBirthDate step={'FORTH'} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ReservationEmail step={'FORTH'} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ReservationPhone step={'FORTH'} />
                </Grid>
            </Grid>
        ),
        step: 'FORTH',
    },
]
function App() {
    const navigate = useNavigate()
    return (
        <RRoutes>
            <Route
                path="/"
                exact
                element={
                    <ReservationDialog
                        isOpen
                        onClose={() => {}}
                        stepsConfiguration={mockStepsConfiguration}
                    />
                }
            />
            <Route path="/news" exact element={<AnnouncementsList />} />
            <Route
                path={'/admin/*'}
                element={
                    <ProtectedRoute shouldLogin loginPath={'/login'}>
                        <AdministrationPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={'/login'}
                exact
                element={
                    <Login
                        onGetUser={() => {
                            navigate('/admin')
                        }}
                        isRegistrationEnabled
                    />
                }
            />
        </RRoutes>
    )
}

export default App
