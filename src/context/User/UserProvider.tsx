import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Key } from 'swr'
import useSWRMutation from 'swr/mutation'
import { useSnackbar } from 'notistack'
import { User } from '../../types'
import axiosGynInstance from '../../api/config'

interface UserData {
    success?: boolean
    token: string
    exp: number
    user?: User
}

interface UserContextType extends Omit<User, 'default_workplace' | 'role'> {
    userError: Error | undefined
    isLoadingUser: boolean
    isLoggedIn: boolean
    automaticallyLoggedOut: boolean
    userRole: string
    defaultWorkplace: string
    logIn: (data: { email: string; password: string }) => void
    logOut: () => void
    logOutAutomatically: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

type SignInPayload = { arg: { email: string; password: string } }
const signIn = async (key: Key, { arg }: SignInPayload) =>
    (await axiosGynInstance.post<UserData>('administration/signIn', arg, { withCredentials: false })).data

export const UserProvider = ({ children }: PropsWithChildren) => {
    const { enqueueSnackbar } = useSnackbar()

    const [automaticallyLoggedOut, logOutAutomatically] = useState(false)

    const [storedUser, setStoredUser] = useState<UserData | undefined>(() => {
        try {
            const item = localStorage.getItem('user')
            return item ? JSON.parse(item) : undefined
        } catch {
            localStorage.removeItem('user')
            return undefined
        }
    })

    const {
        data: userData,
        error: userError,
        isMutating: isLoadingUser,
        trigger: logIn,
        reset,
    } = useSWRMutation<UserData, Error, string, { email: string; password: string }>('api/user', signIn, {
        onSuccess: (data) => {
            localStorage.setItem('user', JSON.stringify(data))
            setStoredUser(data)
        },
    })

    const isLoggedIn = storedUser?.success ?? userData?.success ?? false
    const id = storedUser?.user?.id ?? userData?.user?.id
    const email = storedUser?.user?.email ?? userData?.user?.email
    const name = storedUser?.user?.name ?? userData?.user?.name
    const defaultWorkplace = storedUser?.user?.default_workplace ?? userData?.user?.default_workplace ?? '1'
    const userRole = storedUser?.user?.role ?? userData?.user?.role ?? 'user'

    useEffect(() => {
        if (userError) {
            enqueueSnackbar('Příhlášení nebylo úspěšné, prosím zkuste to později.', { variant: 'error' })
        }
    }, [userError, enqueueSnackbar])

    const value: UserContextType = useMemo(() => ({
        userError,
        isLoadingUser,
        isLoggedIn,
        automaticallyLoggedOut,
        id,
        email,
        name,
        defaultWorkplace,
        userRole,
        logIn,
        logOut: () => {
            reset()
            localStorage.removeItem('user')
            setStoredUser(undefined)
        },
        logOutAutomatically: () => logOutAutomatically((state) => !state),
    }), [userError, isLoadingUser, isLoggedIn, automaticallyLoggedOut, id, email, name, defaultWorkplace, userRole, logIn, reset])

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
