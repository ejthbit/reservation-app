import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAuthInfo } from '../../store/userInfo'

const ProtectedRoute = ({ children, shouldLogin = false, loginPath }) => {
    const isAuthenticated = useSelector(getAuthInfo)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            if (shouldLogin) navigate(loginPath)
            else navigate('/')
        }
    }, [isAuthenticated])

    if (isAuthenticated) return children
    // return isAuthenticated ? (
    //     children
    // ) : shouldLogin ? (
    //     <Navigate to={{ pathname: loginPath }} />
    // ) : (
    //     <Navigate to={{ pathname: '/' }} />
    // )
}
ProtectedRoute.propTypes = {
    children: PropTypes.node,
    shouldLogin: PropTypes.bool,
    loginPath: PropTypes.string,
}

export default ProtectedRoute
