import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/User/UserProvider'
import { withTheme } from '../../hoc'
import { LoginPage, RegistrationPage } from './index'

type LoginProps = {
    onGetUser: () => void
    logo: React.ReactNode
    isRegistrationEnabled: boolean
    adminPath: string
}
const Login = ({ onGetUser, logo, isRegistrationEnabled = false, adminPath = '/admin' }: LoginProps) => {
    const [showRegistration, setShowRegistration] = useState(false)
    const { isLoggedIn } = useUser()
    console.log(isLoggedIn)
    const navigate = useNavigate()

    const handleToggleView = () => setShowRegistration((prevState) => !prevState)

    useEffect(() => {
        isLoggedIn && navigate(adminPath)
    }, [isLoggedIn, adminPath, navigate])

    return (
        <Box>
            {showRegistration ? (
                <RegistrationPage logo={logo} onLoginClick={handleToggleView} />
            ) : (
                <LoginPage
                    logo={logo}
                    onGetUser={onGetUser}
                    isRegistrationEnabled={isRegistrationEnabled}
                    onRegisterClick={handleToggleView}
                />
            )}
        </Box>
    )
}

export default withTheme(Login)
