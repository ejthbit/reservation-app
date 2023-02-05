import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { getAuthInfo } from '../../store/userInfo'

const ProtectedRoute = ({ children, shouldLogin = false, loginPath }) => {
    const isAuthenticated = useSelector(getAuthInfo)
    return isAuthenticated ? (
        children
    ) : shouldLogin ? (
        <Navigate to={{ pathname: loginPath }} />
    ) : (
        <Navigate to={{ pathname: '/' }} />
    )
}
ProtectedRoute.propTypes = {
    children: PropTypes.node,
    shouldLogin: PropTypes.bool,
    loginPath: PropTypes.string,
}

export default ProtectedRoute
