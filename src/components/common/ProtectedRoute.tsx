import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/User/UserProvider'

type ProtectedRouteProps = {
    children: React.ReactNode
    shouldLogin: boolean
    loginPath: string
}

const ProtectedRoute = ({ children, shouldLogin = false, loginPath }: ProtectedRouteProps) => {
    const { isLoggedIn } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
            if (shouldLogin) navigate(loginPath)
            else navigate('/')
        }
    }, [isLoggedIn])

    if (isLoggedIn) return children
    // return isAuthenticated ? (
    //     children
    // ) : shouldLogin ? (
    //     <Navigate to={{ pathname: loginPath }} />
    // ) : (
    //     <Navigate to={{ pathname: '/' }} />
    // )
    return null
}

export default ProtectedRoute
