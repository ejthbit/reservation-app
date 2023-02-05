import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAuthInfo } from '../../store/userInfo'
import { LoginPage, RegistrationPage } from './index'

const Login = ({ onGetUser, logo, isRegistrationEnabled = false, adminPath = '/admin' }) => {
    const [showRegistration, setShowRegistration] = useState(false)
    const isAuthenticated = useSelector(getAuthInfo)
    const navigate = useNavigate()

    const handleToggleView = () => setShowRegistration((prevState) => !prevState)

    useEffect(() => {
        isAuthenticated && navigate(adminPath)
    }, [isAuthenticated])

    return (
        <Box>
            {logo && logo}
            {showRegistration ? (
                <RegistrationPage onLoginClick={handleToggleView} />
            ) : (
                <LoginPage onGetUser={onGetUser} isRegistrationEnabled onRegisterClick={handleToggleView} />
            )}
        </Box>
    )
}

Login.prototype = {
    onGetUser: PropTypes.func,
    logo: PropTypes.node,
    isRegistrationEnabled: PropTypes.bool,
}

export default Login
