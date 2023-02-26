import { Route, Routes as RRoutes, useNavigate } from 'react-router-dom'
import { Login, ReservationDialog, AdministrationPage, AnnouncementsList } from './components'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
    const navigate = useNavigate()
    return (
        <RRoutes>
            <Route path="/" exact element={<ReservationDialog isOpen onClose={() => {}} />} />
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
                            return console.log('route changed to /admin')
                        }}
                        isRegistrationEnabled
                    />
                }
            />
        </RRoutes>
    )
}

export default App
