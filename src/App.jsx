import { Route, Routes as RRoutes, useNavigate } from 'react-router-dom'
import { Login } from './components'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
    const navigate = useNavigate()
    return (
        <RRoutes>
            <Route path="/" exact element={<>Root</>} />
            <Route
                path={'/admin'}
                element={
                    <ProtectedRoute shouldLogin loginPath={'/login'}>
                        <>Admin content</>
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
