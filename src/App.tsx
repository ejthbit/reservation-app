import { Route, Routes as RRoutes, useNavigate } from 'react-router-dom'
import { AdministrationPage, AnnouncementsList, Login, ReservationDialog } from './components'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
    const navigate = useNavigate()
    return (
        <RRoutes>
            <Route path="/" element={<ReservationDialog isOpen onClose={() => {}} />} />
            <Route path="/news" element={<AnnouncementsList />} />
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
