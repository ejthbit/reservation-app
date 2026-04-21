import { Route, Routes as RRoutes, useNavigate } from 'react-router-dom'
import { AdministrationPage, AnnouncementsList, Login, ReservationDialog } from './components'
import ProtectedRoute from './components/common/ProtectedRoute'
import { UserProvider } from './context/User/UserProvider'

function App() {
    const navigate = useNavigate()
    return (
        <RRoutes>
            <Route path="/" element={<ReservationDialog isOpen onClose={() => {}} />} />
            <Route path="/news" element={<AnnouncementsList />} />
            <Route
                path={'/admin/*'}
                element={
                    <UserProvider>
                        <ProtectedRoute shouldLogin loginPath={'/login'}>
                            <AdministrationPage />
                        </ProtectedRoute>
                    </UserProvider>
                }
            />
            <Route
                path={'/login'}
                element={
                    <UserProvider>
                        <Login
                            onGetUser={() => {
                                navigate('/admin')
                            }}
                            isRegistrationEnabled={false}
                        />
                    </UserProvider>
                }
            />
        </RRoutes>
    )
}

export default App
