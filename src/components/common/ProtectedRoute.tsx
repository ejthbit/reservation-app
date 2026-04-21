import { Navigate } from 'react-router-dom'
import { useUser } from '../../context/User/UserProvider'

type ProtectedRouteProps = {
    children: React.ReactNode
    shouldLogin: boolean
    loginPath: string
}

const ProtectedRoute = ({ children, shouldLogin = false, loginPath }: ProtectedRouteProps) => {
    const { isLoggedIn } = useUser()

    if (isLoggedIn) return children

    return shouldLogin ? (
        <Navigate to={{ pathname: loginPath }} replace />
    ) : (
        <Navigate to={{ pathname: '/' }} replace />
    )
}

export default ProtectedRoute
